import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, rtdb, logout } from '../services/firebase';
import { ref as dbRef, onValue } from 'firebase/database';

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

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            clearTimeout(timeout);

            if (firebaseUser) {
                setUser(firebaseUser);

                // Subscribe to RTDB user node for realtime updates
                if (rtdb) {
                    const userRef = dbRef(rtdb, `users/${firebaseUser.uid}`);
                    const unsubscribeRTDB = onValue(userRef, async (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const { getUserRole } = await import('../services/firebase');
                            const dynamicRole = getUserRole(firebaseUser.email);
                            setUserProfile({ ...data, role: dynamicRole || data.role });
                        } else {
                            // Fallback to basic info if RTDB node doesn't exist yet
                            const { getUserRole } = await import('../services/firebase');
                            setUserProfile({
                                uid: firebaseUser.uid,
                                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Người dùng',
                                email: firebaseUser.email,
                                photoURL: firebaseUser.photoURL || '',
                                role: getUserRole(firebaseUser.email)
                            });
                        }
                        setAuthResolved(true);
                    }, (error) => {
                        console.error("RTDB Profile Subscribe Error:", error);
                        setAuthResolved(true);
                    });

                    // Cleanup RTDB listener when auth state changes or unmounts
                    return () => {
                        unsubscribeRTDB();
                    };
                } else {
                    setAuthResolved(true);
                }
            } else {
                setUser(null);
                setUserProfile(null);
                setAuthResolved(true);
            }
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
