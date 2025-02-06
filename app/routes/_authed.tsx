import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { SignIn, useAuth, UserButton } from '@clerk/tanstack-start'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Shirt, Plus } from 'lucide-react'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useCallback, useState } from 'react'

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
  const identity = useAuth()
  const models = useQuery(api.models.getAllByUser, {
    userId: identity?.userId as string,
  })
  const profile = useQuery(api.models.profile)
  const createModel = useMutation(api.models.create)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [shirtName, setShirtName] = useState('')

  const handleCreateModel = useCallback(
    (name: string) => {
      createModel({ name })
      setIsDialogOpen(false)
      setShirtName('')
    },
    [createModel],
  )

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-4 overflow-hidden">
            <UserButton />
            <span className="group-data-[collapsed=true]:hidden">
              {profile?.name}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your T-shirts</SidebarGroupLabel>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SidebarGroupAction title="New Shirt">
                  <Plus /> <span className="sr-only">New Shirt</span>
                </SidebarGroupAction>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>New Shirt</DialogTitle>
                <DialogDescription>Create a new shirt model.</DialogDescription>
                <Input
                  placeholder="Shirt Name"
                  value={shirtName}
                  onChange={(e) => setShirtName(e.target.value)}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => handleCreateModel(shirtName)}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <SidebarGroupContent>
              <SidebarMenu>
                {models?.map((model) => (
                  <SidebarMenuItem key={model._id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/models/$modelId"
                        params={{
                          modelId: model._id,
                        }}
                        className="flex items-center gap-2"
                        activeProps={{ className: 'text-black font-bold' }}
                      >
                        <Shirt />
                        {model.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
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
