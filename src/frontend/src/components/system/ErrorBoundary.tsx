import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '../primitives/Button';
import { logNavigationContext } from '@/utils/errorBoundaryDiagnostics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced logging with navigation context for debugging
    logNavigationContext(error, errorInfo);
  }

  handleRetry = () => {
    // Deterministic recovery: full page reload to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f1419] flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card p-8 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something unexpected happened
              </h1>
              <p className="text-muted-foreground">
                We encountered an issue loading this page. This isn't your fault—please try again.
              </p>
            </div>
            
            <Button variant="primary" onClick={this.handleRetry} className="w-full">
              Try Again
            </Button>
            
            <p className="text-sm text-muted-foreground">
              If this continues, please refresh your browser.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
