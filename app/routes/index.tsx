import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { api } from 'convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const createPost = useMutation(api.posts.create)

  const posts = useQuery(api.posts.list)

  return (
    <main className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-5xl font-bold pt-7">Luke Design</h1>

      <div>{posts?.map((post) => <div key={post.id}>{post.title}</div>)}</div>

      <Button
        onClick={() =>
          createPost({
            title: 'New Post',
            body: 'This is a new post',
          })
        }
      >
        Add Post
      </Button>
    </main>
  )
}
