import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardPage } from './pages/Dashboard';
import { ConversionsPage } from './pages/Conversions';
import { WebsitesPage } from './pages/Websites';
import { LeadsPage } from './pages/Leads';
import { TrackingLinksPage } from './pages/TrackingLinks';
import { SettingsPage } from './pages/Settings';
import { AnalyticsPage } from './pages/Analytics';
import { AuthPage } from './pages/Auth/AuthPage';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

export default function App() {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {user ? (
          <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/websites"
                  element={
                    <PrivateRoute>
                      <WebsitesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <PrivateRoute>
                      <LeadsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/conversions"
                  element={
                    <PrivateRoute>
                      <ConversionsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tracking-links"
                  element={
                    <PrivateRoute>
                      <TrackingLinksPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <AnalyticsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <SettingsPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </Router>
    </QueryClientProvider>
  );
}