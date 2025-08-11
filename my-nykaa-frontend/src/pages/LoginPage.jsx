// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { api } from '../api';

const LoginPage = ({ setPage, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await api.post('/auth/login', { email, password });
            onLoginSuccess(data);
            setPage('home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md p-8 my-12 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-pink-500 mb-8">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                    <input
                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button type="submit" disabled={loading} className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-pink-300">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setPage('register')} className="font-bold text-pink-500 hover:text-pink-700">
                        Register here
                    </button>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
