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
import { Shirt, Plus, Trash2 } from 'lucide-react'
import { api } from 'convex/_generated/api'
import { useQuery, useMutation } from 'convex/react'
import { useAuth } from '@clerk/clerk-react'
import { UserButton } from '@clerk/tanstack-start'
import { Link } from '@tanstack/react-router'
import CreateTShirtModal from './CreateTShirtModal'
import { Button } from './ui/button'
import { Id } from 'convex/_generated/dataModel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { useState } from 'react'

// I've created a main sidebar component that displays the user's models
// I've made a "t-shirt" group that displays the user's t-shirts
// I have made everything generic so that it can be reused for other types of models
export default function MainSidebar() {
  // Get all of the users models
  const identity = useAuth()
  const models = useQuery(api.models.getAllByUser, {
    userId: identity?.userId as string,
  })
  const deleteModel = useMutation(api.models.deleteModel)
  const [modelToDelete, setModelToDelete] = useState<{
    id: Id<'models'>
    name: string
  } | null>(null)

  const profile = useQuery(api.models.profile)

  const handleDelete = async () => {
    if (!modelToDelete) return
    await deleteModel({ modelId: modelToDelete.id })
    setModelToDelete(null)
  }

  return (
    <>
      <Dialog
        open={modelToDelete !== null}
        onOpenChange={() => setModelToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete T-Shirt Design</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{modelToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setModelToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-4 overflow-hidden py-2">
            <UserButton />
            <span className="group-data-[collapsed=true]:hidden">
              {profile?.name}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your T-shirts</SidebarGroupLabel>
            <CreateTShirtModal>
              <SidebarGroupAction title="New Shirt">
                <Plus /> <span className="sr-only">New Shirt</span>
              </SidebarGroupAction>
            </CreateTShirtModal>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3 mt-3">
                {models?.map((model, index) => (
                  <SidebarMenuItem key={model._id}>
                    <Link
                      to="/models/$modelId"
                      params={{
                        modelId: model._id,
                      }}
                      className="flex items-center w-full"
                      activeProps={{
                        className: 'text-black font-bold',
                      }}
                      inactiveProps={{
                        className: 'text-gray-500 font-light',
                      }}
                    >
                      {({ isActive }) => (
                        <div className="flex items-center gap-2 w-full">
                          <SidebarMenuButton className="p-4 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="relative -ml-[6px]">
                                <Shirt className="w-7 h-7" />
                                <span className="absolute inset-0 mt-[1px] flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="group-data-[collapsible=icon]:hidden">
                                {model.name}
                              </span>
                            </div>
                          </SidebarMenuButton>
                          {!isActive && (
                            <div className="group-data-[collapsible=icon]:hidden">
                              <SidebarMenuButton
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setModelToDelete({
                                    id: model._id,
                                    name: model.name,
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  Delete {model.name}
                                </span>
                              </SidebarMenuButton>
                            </div>
                          )}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
