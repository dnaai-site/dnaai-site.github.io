import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, logout } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        let unsubProfile = null;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (unsubProfile) {
                unsubProfile();
                unsubProfile = null;
            }

            if (firebaseUser) {
                setUser(firebaseUser);
                const docRef = doc(db, 'users', firebaseUser.uid);

                unsubProfile = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    } else {
                        setUserProfile({
                            username: firebaseUser.email?.split('@')[0] || 'Người dùng',
                            email: firebaseUser.email
                        });
                    }
                    setLoading(false);
                }, (error) => {
                    console.warn('Profile fetch error:', error);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
            if (unsubProfile) unsubProfile();
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, logout: handleLogout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
