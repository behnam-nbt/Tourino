'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for async actions

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                setLoading(false); // No token, no need to fetch user
                return;
            }

            try {
                const { data } = await api.get('/user/profile'); // Fetch user profile
                setUser(data); // Set user data
            } catch (error) {
                Cookies.remove("accessToken"); // Remove invalid token
                Cookies.remove("refreshToken");
            } finally {
                setLoading(false); // Always stop loading
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        if (typeof window !== "undefined") {
            window.location.href = "/"; // Redirect to auth page
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
