
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'react-hot-toast';


interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {



  return (
    <div className="flex bg-gray-100">
      <Sidebar  />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header      />
        <main className="flex-1 overflow-y-auto p-6">
          <div style={{height:815,overflow:'auto'}}> 
          {children}
          <Toaster position="top-right" />
          </div>
        </main>
      </div>
    </div>
  );
}
