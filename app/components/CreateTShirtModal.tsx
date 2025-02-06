import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import { useState, useCallback } from 'react'

export default function CreateTShirtModal({
  children,
}: {
  children: React.ReactNode
}) {
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          <Button onClick={() => handleCreateModel(shirtName)}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
