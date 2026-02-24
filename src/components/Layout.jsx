import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isHome = location.pathname === '/';

    const isActive = (path) => location.pathname === path;

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Đóng mobile menu khi chuyển trang
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
    ];

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
                <nav className="desktop-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link${link.active ? ' active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth Section */}
                <div className="auth-nav">
                    {user ? (
                        <div className="user-menu" style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                className="user-avatar-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                                aria-label="Mở menu tài khoản"
                            >
                                <div className="user-avatar" style={{ background: userProfile?.photoURL ? 'none' : 'var(--primary)', overflow: 'hidden' }}>
                                    {userProfile?.photoURL ? (
                                        <img src={userProfile.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        (userProfile?.username || user.email || 'U')[0].toUpperCase()
                                    )}
                                </div>
                                <span className="user-name">{userProfile?.username || 'Người dùng'}</span>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }}>
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
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
                                        <div>
                                            <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9375rem' }}>{userProfile?.username || 'Người dùng'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
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
                                    <button className="dropdown-item danger" onClick={handleLogout}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <Link to="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: '700', whiteSpace: 'nowrap' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>Đăng ký</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Mở menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {mobileMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="mobile-drawer">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`mobile-nav-link${link.active ? ' active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(139,92,246,0.15)', margin: '0.5rem 0' }} />
                    {user ? (
                        <>
                            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '2.25rem', height: '2.25rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.9375rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {userProfile?.photoURL ? <img src={userProfile.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : (userProfile?.username || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{userProfile?.username}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                                </div>
                            </div>
                            <Link to="/settings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>⚙️ Cài đặt tài khoản</Link>
                            <button className="mobile-nav-link danger-link" onClick={handleLogout}>↪️ Đăng xuất</button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem' }}>
                            <Link to="/login" className="btn" style={{ flex: 1, textDecoration: 'none', background: 'rgba(139,92,246,0.08)', color: 'var(--primary)', fontSize: '0.875rem', padding: '0.625rem 1rem' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', fontSize: '0.875rem', padding: '0.625rem 1rem' }}>Đăng ký</Link>
                        </div>
                    )}
                </div>
            )}

            <main className="fade-in">
                {children}
            </main>

            <footer>
                <p>© 2026 HeartSpace by <strong>DNA AI</strong> | <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Chính sách bảo mật</Link></p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Mọi thông tin trao đổi đều mang tính chất tham khảo và hỗ trợ giải tỏa cảm xúc.</p>
            </footer>
        </div>
    );
};

export default Layout;
