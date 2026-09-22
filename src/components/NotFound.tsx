import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <p className="text-6xl font-semibold tracking-tight">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for doesn&rsquo;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-2">
        <Button render={<Link to="/" />}>Go home</Button>
        <Button render={<Link to="/login" />} variant="outline">
          Sign in
        </Button>
      </div>
    </div>
  )
}

export default NotFound