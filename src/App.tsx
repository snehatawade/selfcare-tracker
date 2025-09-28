import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddLogForm } from './components/AddLogForm';
import { History } from './components/History';
import type { DailyLog } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'add-log' | 'history'>('dashboard');

  const handleEditLog = (log: DailyLog) => {
    setCurrentPage('add-log');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'add-log' && <AddLogForm />}
      {currentPage === 'history' && <History onEditLog={handleEditLog} />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;