import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToNotifications, markNotificationAsRead } from '../services/firebase';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const isHome = location.pathname === '/';

    const isActive = (path) => location.pathname === path;

    // Sub to notifications
    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
        });
        return () => unsubscribe();
    }, [user]);

    // Close logic
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/', label: 'Trang chủ', active: isHome },
        { to: '/chatbot', label: 'AI Tâm Lý', active: isActive('/chatbot') },
        { to: '/mbti', label: 'MBTI', active: isActive('/mbti') },
        { to: '/test', label: 'Đánh giá', active: isActive('/test') },
        { to: '/emotion', label: 'Thư giãn', active: isActive('/emotion') },
        { to: '/library', label: 'Thư viện', active: isActive('/library') },
        { to: '/community', label: 'Cộng đồng', active: isActive('/community') },
        { to: '/messages', label: 'Tin nhắn', active: isActive('/messages') || location.pathname.startsWith('/messages/') },
        { to: '/admin', label: 'Quản trị', active: isActive('/admin'), roles: ['super_admin', 'admin', 'dev'] },
    ];

    const visibleNavLinks = navLinks.filter(link =>
        !link.roles || (userProfile && link.roles.includes(userProfile.role))
    );

    const navRef = useRef(null);

    // Auto-scroll to active link in narrow desktop nav
    useEffect(() => {
        const activeLink = navRef.current?.querySelector('.nav-link.active');
        if (activeLink) {
            activeLink.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [location.pathname]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = async (notif) => {
        if (!notif.read && user) {
            await markNotificationAsRead(user.uid, notif.id);
        }
        if (notif.link) {
            navigate(notif.link);
            setShowNotifications(false);
        }
    };

    return (
        <div className="app-container">
            {/* Background Elements */}
            <div className="bg-grid"></div>
            <div className="bg-blob" style={{ top: '-100px', left: '-100px' }}></div>
            <div className="bg-blob" style={{ bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>

            <header>
                <Link to="/" className="logo-wrapper" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">
                        <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
                    </div>
                    <span className="app-title">HeartSpace</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav" ref={navRef}>
                    {visibleNavLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link${link.active ? ' active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth & Notifications Section */}
                <div className="auth-nav">
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="notification-bell-wrapper" ref={notificationRef} style={{ position: 'relative', marginRight: '0.5rem' }}>
                                <button
                                    className="icon-btn"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    style={{
                                        background: 'rgba(255,255,255,0.8)',
                                        border: '1.5px solid #f1f5f9',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        color: '#64748b'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-4px',
                                            background: '#ef4444',
                                            color: 'white',
                                            fontSize: '0.625rem',
                                            fontWeight: '800',
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid white'
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="dropdown-menu notification-dropdown" style={{ right: 0, width: '320px' }}>
                                        <div className="dropdown-header" style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{ fontWeight: '800', fontSize: '0.875rem' }}>Thông báo</span>
                                        </div>
                                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>Không có thông báo mới.</div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        className={`notification-item ${n.read ? 'read' : 'unread'}`}
                                                        onClick={() => handleNotificationClick(n)}
                                                        style={{
                                                            padding: '0.75rem 1rem',
                                                            borderBottom: '1px solid #f8fafc',
                                                            cursor: 'pointer',
                                                            background: n.read ? 'transparent' : 'rgba(139, 92, 246, 0.03)',
                                                            display: 'flex',
                                                            gap: '0.75rem',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: n.type === 'alert' ? '#ef4444' : n.type === 'success' ? '#22c55e' : 'var(--primary)',
                                                            marginTop: '0.375rem',
                                                            flexShrink: 0,
                                                            opacity: n.read ? 0.3 : 1
                                                        }}></div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.8125rem', fontWeight: n.read ? '600' : '800', color: '#1e293b', marginBottom: '0.125rem' }}>{n.title}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>{n.message}</div>
                                                            <div style={{ fontSize: '0.625rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                                                {n.createdAt?.toDate().toLocaleString('vi-VN')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="user-menu" style={{ position: 'relative' }} ref={dropdownRef}>
                                <button
                                    className="user-avatar-btn"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <div className="user-avatar" style={{ background: userProfile?.photoURL ? 'none' : 'var(--primary)', overflow: 'hidden' }}>
                                        {userProfile?.photoURL ? (
                                            <img src={userProfile.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            (userProfile?.username || user.email || 'U')[0].toUpperCase()
                                        )}
                                    </div>
                                    <span className="user-name">{userProfile?.username || 'Người dùng'}</span>
                                </button>
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar" style={{ background: userProfile?.photoURL ? 'none' : 'var(--primary)', overflow: 'hidden' }}>
                                                {userProfile?.photoURL ? (
                                                    <img src={userProfile.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    (userProfile?.username || user.email || 'U')[0].toUpperCase()
                                                )}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile?.username || 'Người dùng'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                                            </div>
                                        </div>
                                        <hr style={{ margin: '0.75rem 0', borderColor: '#f1f5f9' }} />
                                        <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="3"></circle>
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                            </svg>
                                            Cài đặt tài khoản
                                        </Link>
                                        <Link to="/support" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            Trung tâm hỗ trợ
                                        </Link>
                                        <button className="dropdown-item danger" onClick={handleLogout}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <Link to="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>Đăng ký</Link>
                        </div>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {mobileMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="mobile-drawer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)' }}>HeartSpace Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8' }}>&times;</button>
                    </div>
                    {visibleNavLinks.map(link => (
                        <Link key={link.to} to={link.to} className={`mobile-nav-link${link.active ? ' active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(139,92,246,0.1)', margin: '0.5rem 0' }} />
                    {user ? (
                        <>
                            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="user-avatar" style={{ background: 'var(--primary)', width: '40px', height: '40px' }}>
                                    {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (userProfile?.username || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{userProfile?.username}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                                </div>
                            </div>
                            <Link to="/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>⚙️ Cài đặt</Link>
                            <Link to="/support" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>❔ Hỗ trợ</Link>
                            <button className="mobile-nav-link danger-link" onClick={handleLogout}>↪️ Đăng xuất</button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem' }}>
                            <Link to="/login" className="btn" style={{ flex: 1, textDecoration: 'none', background: '#f5f3ff', color: 'var(--primary)' }} onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>Đăng ký</Link>
                        </div>
                    )}
                </div>
            )}

            <main className="fade-in"> {children} </main>

            <footer>
                <p>© 2026 HeartSpace by <strong>DNA AI</strong> | <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Bảo mật</Link> | <Link to="/support" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Hỗ trợ</Link></p>
            </footer>
        </div>
    );
};

export default Layout;
