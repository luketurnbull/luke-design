import { createFileRoute } from '@tanstack/react-router'
import CreateTShirtModal from '~/components/CreateTShirtModal'

/**
 * This route is used to display the dashboard page.
 * It is wrapped in the _authed route so only authenticated users can access it.
 */
export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col gap-2 mb-12 p-6">
        <h2 className="text-2xl md:text-6xl font-bold mb-6">
          Design your own t-shirts
        </h2>
        <p className="text-muted-foreground">
          Get started by creating a new t-shirt design. click{' '}
          <CreateTShirtModal>
            <a className="text-blue-500 hover:underline cursor-pointer">here</a>
          </CreateTShirtModal>{' '}
          to create a new design, or open up the sidebar to get started.
        </p>
        <p className="text-muted-foreground">
          Your designs will be saved to your account and can be accessed from
          anywhere.
        </p>
        <p className="text-muted-foreground">
          Share links to your designs with your friends and family.
        </p>
      </div>
    </div>
  )
}
