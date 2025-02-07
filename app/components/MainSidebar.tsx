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

// I've created a main sidebar component that displays the user's models
// I've made a "t-shirt" group that displays the user's t-shirts
// I have made everything generic so that it can be reused for other types of models
export default function MainSidebar() {
  // Get all of the users models
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
              {models?.map((model, index) => (
                <SidebarMenuItem key={model._id}>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/models/$modelId"
                      params={{
                        modelId: model._id,
                      }}
                      className="flex items-center gap-2"
                      activeProps={{
                        className: 'text-black font-bold',
                      }}
                      inactiveProps={{
                        className: 'text-gray-500 font-light',
                      }}
                    >
                      {/* Added shirts icons with numbers inside to allow the user to quickly change between their designs */}
                      <div className="relative -ml-[6px]">
                        <Shirt className="w-7 h-7" />
                        <span className="absolute inset-0 mt-[1px] flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
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
