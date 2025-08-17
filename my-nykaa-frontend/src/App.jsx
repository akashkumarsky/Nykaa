// src/App.jsx
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.jsx';

// Layout Components
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import CartSidebar from './components/cart/CartSidebar.jsx';
import MobileMenu from './components/layout/MobileMenu.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Check for a logged-in user in local storage on initial app load
    useEffect(() => {
        const storedUser = localStorage.getItem('nykaaUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to handle successful login
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('nykaaUser', JSON.stringify(userData));
    };

    // Function to handle logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('nykaaUser');
        setPage('home'); // Redirect to home page after logout
    };

    // Simple router to render the correct page based on the 'page' state
    const renderPage = () => {
        switch (page) {
            case 'login':
                return <LoginPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
            case 'register':
                return <RegisterPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
            case 'products':
                return <AllProductsPage setPage={setPage} setSelectedProductId={setSelectedProductId} />;
            case 'checkout':
                return <CheckoutPage setPage={setPage} />;
            case 'productDetail':
                return <ProductDetailPage productId={selectedProductId} setPage={setPage} />;
            case 'orders':
                return <OrderHistoryPage />;
            case 'admin':
                return <AdminPage />;
            case 'home':
            default:
                return <HomePage setPage={setPage} setSelectedProductId={setSelectedProductId} />;
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
                    onMenuClick={() => setIsMenuOpen(true)}
                />
                <CartSidebar 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                    setPage={setPage}
                />
                <MobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    setPage={setPage}
                    user={user?.user}
                    onLogout={handleLogout}
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
