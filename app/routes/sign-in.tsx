import {
  SignedIn,
  SignedOut,
  SignIn as ClerkSignIn,
} from '@clerk/tanstack-start'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <h1 className="text-2xl md:text-7xl font-bold pt-4 md:pt-7">
          Luke Design
        </h1>
        <p className="text-xl pb-4">
          A design product for creating cool t-shirt designs.
        </p>
        <SignedOut>
          <ClerkSignIn routing="hash" />
        </SignedOut>
        <SignedIn>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowRightIcon className="w-4 h-4" />
              Go to dashboard
            </Link>
          </Button>
        </SignedIn>
      </div>
    </main>
  )
}
