import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'
import CreateTShirtModal from '~/components/CreateTShirtModal'

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
