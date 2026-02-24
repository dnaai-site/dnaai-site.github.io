import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, logout } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Khởi đầu loading=false để UI render NGAY LẬP TỨC
    // user=undefined nghĩa là "chưa biết", null="chưa đăng nhập"
    const [user, setUser] = useState(undefined);
    const [userProfile, setUserProfile] = useState(null);
    const [authResolved, setAuthResolved] = useState(false);

    useEffect(() => {
        // Ẩn HTML init loader ngay khi React mount
        if (window.__hideInitLoader) {
            window.__hideInitLoader();
        }

        if (!auth) {
            setUser(null);
            setAuthResolved(true);
            return;
        }

        // Timeout an toàn: sau 8s nếu Firebase vẫn chưa trả về → coi như chưa đăng nhập
        const timeout = setTimeout(() => {
            if (!authResolved) {
                setUser(null);
                setAuthResolved(true);
            }
        }, 8000);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeout);

            if (firebaseUser) {
                setUser(firebaseUser);

                // Load profile không block UI
                try {
                    if (db) {
                        const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                        if (docSnap.exists()) {
                            setUserProfile(docSnap.data());
                        } else {
                            setUserProfile({
                                username: firebaseUser.email?.split('@')[0] || 'Người dùng',
                                email: firebaseUser.email,
                                photoURL: firebaseUser.photoURL || ''
                            });
                        }
                    }
                } catch (error) {
                    console.warn('Profile fetch error:', error);
                    setUserProfile({
                        username: firebaseUser.email?.split('@')[0] || 'Người dùng',
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL || ''
                    });
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }

            setAuthResolved(true);
        });

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        if (auth) await logout();
        setUser(null);
        setUserProfile(null);
    };

    // Truyền user=null khi chưa biết (undefined) để UI render bình thường
    // Chỉ các component cần auth mới cần check authResolved
    const contextUser = user === undefined ? null : user;

    return (
        <AuthContext.Provider value={{
            user: contextUser,
            userProfile,
            loading: !authResolved,
            authResolved,
            logout: handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
