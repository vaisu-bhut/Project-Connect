import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { User, UserContextType } from '@/types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Fetch user data if we have a token
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    withCredentials: true
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (document.cookie.includes('token')) {
            fetchUser();
        }
    }, []);

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            toast.success('Logged out successfully');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Error logging out');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 