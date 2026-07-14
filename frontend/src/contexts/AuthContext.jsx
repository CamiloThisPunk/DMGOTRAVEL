import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password, remember = false) => {
        try {
            // First try to get CSRF cookie (may fail silently, that's ok for token auth)
            try {
                await api.get('/sanctum/csrf-cookie');
            } catch (csrfError) {
                console.warn("CSRF cookie fetch failed, continuing with token auth:", csrfError.message);
            }
            
            const response = await api.post('/api/auth/login', { email, password });
            console.log("Login API Response:", JSON.stringify(response.data));
            
            const userData = response.data?.data?.user || response.data?.user;
            const token = response.data?.data?.token || response.data?.token;
            
            if (!userData) {
                throw new Error("No user data in response");
            }
            
            // Set token immediately for all future requests
            if (token) {
                if (remember) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            
            setUser(userData);
            if (remember) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }
            return userData;
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.response?.status || error.message);
            throw error;
        }
    };

    const register = async (name, email, phone, password, password_confirmation) => {
        const response = await api.post('/api/auth/register', {
            name,
            email,
            phone,
            password,
            password_confirmation
        });
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (response.data.data.token) {
             localStorage.setItem('token', response.data.data.token);
             api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        }
        return userData;
    };

    const loginWithGoogleToken = async (token) => {
        try {
            // Set token immediately
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch user data from /me endpoint
            const response = await api.get('/api/auth/me');
            console.log('Google login /me response:', JSON.stringify(response.data));
            
            const userData = response.data.user;
            
            if (!userData) {
                throw new Error('No user data received from /api/auth/me');
            }
            
            // Ensure roles is always an array
            if (!userData.roles) {
                console.warn('User has no roles, defaulting to ["client"]');
                userData.roles = ['client'];
            }
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error("Google Token Login Error:", error?.response?.status, error?.response?.data || error.message);
            logout();
            throw error;
        }
    };

    const updateProfile = async (data) => {
        const response = await api.patch('/api/client/profile', data);
        const updatedUser = response.data.user;
        setUser(updatedUser);
        if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return updatedUser;
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (e) {
            console.error("Error logging out", e);
        }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogleToken, register, logout, loading, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
