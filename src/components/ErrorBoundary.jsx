import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL REACT RENDER ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090f1f',
          color: '#f8fafc',
          padding: '40px 20px',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #ef4444',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <h1 style={{ color: '#f87171', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              ⚠️ Application Render Notice
            </h1>
            <p style={{ color: '#cbd5e1', marginBottom: '16px', fontSize: '14px' }}>
              An error occurred during dashboard initialization:
            </p>
            <pre style={{
              backgroundColor: '#0f172a',
              color: '#fca5a5',
              padding: '16px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '13px',
              fontFamily: 'monospace',
              border: '1px solid #334155'
            }}>
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#06b6d4',
                  color: '#000',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Reload Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                style={{
                  backgroundColor: '#334155',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
