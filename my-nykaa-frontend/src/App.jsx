// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.jsx';

// Layout Components
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import CartSidebar from './components/cart/CartSidebar.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

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
            case 'products':
                return <AllProductsPage />;
            case 'checkout':
                return <CheckoutPage setPage={setPage} />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <CartProvider user={user}>
            <div className="bg-white font-sans flex flex-col min-h-screen">
                <Header
                    setPage={setPage}
                    user={user?.user}
                    onLogout={handleLogout}
                    onCartClick={() => setIsCartOpen(true)}
                />
                {/* FIXED: Pass the setPage function as a prop to the sidebar */}
                <CartSidebar
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    setPage={setPage}
                />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
}

export default App;
