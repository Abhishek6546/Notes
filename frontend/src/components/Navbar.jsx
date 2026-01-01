import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                TaskFlow
            </div>
            <div className="navbar-nav">
                <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                {user?.role === 'admin' && (
                    <Link
                        to="/users"
                        className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
                    >
                        Users
                    </Link>
                )}
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user?.name}</span>
                    <button className="btn btn-secondary btn-sm" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
