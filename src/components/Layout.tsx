import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Plus, Clock, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'add-log' | 'history';
  onPageChange: (page: 'dashboard' | 'add-log' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SelfCare</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Home },
              { key: 'add-log', label: 'Add Log', icon: Plus },
              { key: 'history', label: 'History', icon: Clock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onPageChange(key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentPage === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};