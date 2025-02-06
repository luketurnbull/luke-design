import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from '~/components/ui/sidebar'
import { Shirt, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useCallback, useState } from 'react'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useAuth } from '@clerk/clerk-react'
import { UserButton } from '@clerk/tanstack-start'
import { Link } from '@tanstack/react-router'

export default function MainSidebar() {
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
              <DialogHeader>
                <DialogTitle>New Shirt</DialogTitle>
                <DialogDescription>Create a new shirt model.</DialogDescription>
              </DialogHeader>
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
  )
}
