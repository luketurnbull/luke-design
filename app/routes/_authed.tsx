import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatches,
} from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import MainSidebar from '~/components/MainSidebar'
import { api } from 'convex/_generated/api'
import { useConvexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Loader2 } from 'lucide-react'

/**
 * This route is used to wrap the entire application in a sidebar and breadcrumb.
 * It also checks if the user is authenticated and redirects to the home page if not.
 */
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      throw redirect({
        to: '/sign-in',
      })
    }

    throw error
  },
  component: RouteComponent,
})

function RouteComponent() {
  // Get all active route matches
  const matches = useMatches()
  // Find the model route match if it exists
  const modelMatch = matches.find(
    (match) => match.routeId === '/_authed/models/$modelId',
  )
  const modelId = modelMatch?.params?.modelId as Id<'models'> | undefined
  const model = useConvexQuery(
    api.models.getById,
    modelId ? { modelId } : 'skip',
  )

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <MainSidebar />
        <div className="flex-1 grid grid-rows-[auto_1fr] min-h-0 overflow-hidden w-full">
          <div className="bg-sidebar shadow-md w-full">
            <nav className="flex gap-6 items-center h-16 px-4 w-full">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link
                      to="/"
                      activeProps={{
                        className: 'font-bold',
                      }}
                      activeOptions={{ exact: true }}
                    >
                      Dashboard
                    </Link>
                  </BreadcrumbItem>
                  {modelId && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {model ? (
                          <Link
                            to="/models/$modelId"
                            params={{ modelId }}
                            activeProps={{
                              className: 'font-bold',
                            }}
                          >
                            {model.name}
                          </Link>
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </nav>
          </div>
          <main className="min-h-0 overflow-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
