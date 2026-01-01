import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return user ? <Navigate to="/dashboard" /> : children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}

export default App;
