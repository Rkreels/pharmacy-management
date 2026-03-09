import React from 'react';
    import Sidebar from './Sidebar';

    interface LayoutProps {
      children: React.ReactNode;
    }

    const Layout: React.FC<LayoutProps> = ({ children }) => {
      return (
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="h-16 flex items-center justify-between px-8 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-lg font-medium text-foreground">Store Operations</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-foreground font-medium">System Online</span>
              </div>
            </div>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      );
    };

    export default Layout;