// src/App.jsx
import React, { useState, useEffect } from 'react';

// Layout Components
// FIXED: Added .jsx extension to make import paths explicit.
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

// Page Components
// FIXED: Added .jsx extension to make import paths explicit.
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function App() {
    const [page, setPage] = useState('home'); // Simple router: 'home', 'login', 'register'
    const [user, setUser] = useState(null); // Holds user data { user: {...}, jwtToken: "..." }

    // On initial load, check if user data is in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('nykaaUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('nykaaUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('nykaaUser');
        setPage('home');
    };

    const renderPage = () => {
        switch (page) {
            case 'login':
                return <LoginPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
            case 'register':
                return <RegisterPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="bg-white font-sans flex flex-col min-h-screen">
            <Header setPage={setPage} user={user?.user} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

export default App;
