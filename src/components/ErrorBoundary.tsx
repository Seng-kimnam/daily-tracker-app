import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

type ErrorBoundaryProps = {
  children: ReactNode
  fallbackTitle?: string
  fallbackDescription?: string
  onRetry?: () => void
}

type ErrorBoundaryState = {
  hasError: boolean
  message: string | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    }
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary]", error)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: null })
    this.props.onRetry?.()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div
        role="alert"
        className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
      >
        <p className="text-sm font-medium text-destructive">
          {this.props.fallbackTitle ?? "Something went wrong."}
        </p>
        {this.props.fallbackDescription && (
          <p className="text-sm text-destructive/80">
            {this.props.fallbackDescription}
          </p>
        )}
        {this.state.message && (
          <p className="text-xs text-muted-foreground">{this.state.message}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={this.handleRetry}
        >
          Try again
        </Button>
      </div>
    )
  }
}

export default ErrorBoundary