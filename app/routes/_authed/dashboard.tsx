import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'
import CreateTShirtModal from '~/components/CreateTShirtModal'

/**
 * This route is used to display the dashboard page.
 * It is wrapped in the _authed route so only authenticated users can access it.
 */
export const Route = createFileRoute('/_authed/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <CreateTShirtModal>
        <Button>
          <Plus />
          Create T-Shirt
        </Button>
      </CreateTShirtModal>
    </div>
  )
}
