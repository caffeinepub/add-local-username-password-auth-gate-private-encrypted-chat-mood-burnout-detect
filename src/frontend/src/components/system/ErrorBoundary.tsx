import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '../primitives/Button';
import { logNavigationContext } from '@/utils/errorBoundaryDiagnostics';
import { ChevronDown } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
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

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, showDetails } = this.state;
      
      // Extract error details safely
      const errorName = error?.name || 'Error';
      const errorMessage = error?.message || 'An unknown error occurred';
      const errorStack = error?.stack || '';
      
      // Get first few lines of stack for display
      const stackLines = errorStack.split('\n').slice(0, 5).join('\n');

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

            {/* Technical details section - collapsed by default */}
            <details className="text-left mt-6">
              <summary 
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 select-none"
                onClick={(e) => {
                  e.preventDefault();
                  this.toggleDetails();
                }}
              >
                <span>Technical Details</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                />
              </summary>
              
              {showDetails && (
                <div className="mt-4 p-4 bg-black/30 rounded-lg space-y-3 text-xs font-mono">
                  <div>
                    <div className="text-muted-foreground mb-1">Error Type:</div>
                    <div className="text-destructive font-semibold">{errorName}</div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground mb-1">Message:</div>
                    <div className="text-foreground break-words">{errorMessage}</div>
                  </div>
                  
                  {stackLines && (
                    <div>
                      <div className="text-muted-foreground mb-1">Stack Trace (excerpt):</div>
                      <pre className="text-foreground/80 whitespace-pre-wrap break-words text-[10px] leading-relaxed">
                        {stackLines}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
