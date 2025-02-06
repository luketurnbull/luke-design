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
import { api } from 'convex/_generated/api'
import { useQuery } from 'convex/react'
import { useAuth } from '@clerk/clerk-react'
import { UserButton } from '@clerk/tanstack-start'
import { Link } from '@tanstack/react-router'
import CreateTShirtModal from './CreateTShirtModal'

export default function MainSidebar() {
  const identity = useAuth()
  const models = useQuery(api.models.getAllByUser, {
    userId: identity?.userId as string,
  })
  const profile = useQuery(api.models.profile)

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
          <CreateTShirtModal>
            <SidebarGroupAction title="New Shirt">
              <Plus /> <span className="sr-only">New Shirt</span>
            </SidebarGroupAction>
          </CreateTShirtModal>
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
