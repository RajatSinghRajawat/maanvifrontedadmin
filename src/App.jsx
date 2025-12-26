import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';

const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          {/* Login should always be accessible */}
          <Route path="/login" element={<Login />} />

          {/* Protected dashboard (admin panel) */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          />

          {/* Default routing: first open -> login; after login -> dashboard */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;