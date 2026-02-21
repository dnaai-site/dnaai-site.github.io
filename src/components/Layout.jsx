import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const isHome = location.pathname === '/';

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
        navigate('/');
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
                <nav>
                    <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>Trang chủ</Link>
                    <Link to="/chatbot" className={`nav-link ${isActive('/chatbot') ? 'active' : ''}`}>AI Tâm Lý</Link>
                    <Link to="/mbti" className={`nav-link ${isActive('/mbti') ? 'active' : ''}`}>MBTI</Link>
                    <Link to="/test" className={`nav-link ${isActive('/test') ? 'active' : ''}`}>Đánh giá</Link>
                    <Link to="/emotion" className={`nav-link ${isActive('/emotion') ? 'active' : ''}`}>Thư giãn</Link>
                    <Link to="/library" className={`nav-link ${isActive('/library') ? 'active' : ''}`}>Thư viện</Link>
                    <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>Cộng đồng</Link>
                </nav>

                {/* Auth Section */}
                <div className="auth-nav">
                    {user ? (
                        <div className="user-menu" style={{ position: 'relative' }}>
                            <button
                                className="user-avatar-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="user-avatar">
                                    {(userProfile?.username || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <span className="user-name">{userProfile?.username || 'Người dùng'}</span>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <div className="dropdown-avatar">
                                            {(userProfile?.username || user.email || 'U')[0].toUpperCase()}
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
                            <Link to="/login" className="nav-link" style={{ color: 'var(--primary)', fontWeight: '700' }}>Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none' }}>Đăng ký</Link>
                        </div>
                    )}
                </div>
            </header>

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
