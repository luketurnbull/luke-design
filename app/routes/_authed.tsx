import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { SignIn, UserButton } from '@clerk/tanstack-start'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import MainSidebar from '~/components/MainSidebar'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return (
        <div className="flex items-center justify-center p-12">
          <SignIn routing="hash" forceRedirectUrl={window.location.href} />
        </div>
      )
    }

    throw error
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="grid grid-rows-[auto_1fr]">
        <div className="p-4 text-lg fixed top-0 bg-white w-screen shadow-md">
          <nav className="flex gap-6 items-center mx-auto">
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
                    Luke Design
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/models/$modelId"
                    params={{
                      modelId: '123',
                    }}
                  >
                    Model 1
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <UserButton />
            </div>
          </nav>
        </div>
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
