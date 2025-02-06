import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h1>Hello Clerk!</h1>

      <Button asChild>
        <Link to="/posts">Posts</Link>
      </Button>
    </div>
  )
}
