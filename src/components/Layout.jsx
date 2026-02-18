import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="app-container">
            {/* Background Elements */}
            <div className="bg-grid"></div>
            <div className="bg-blob" style={{ top: '-100px', left: '-100px' }}></div>
            <div className="bg-blob" style={{ bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(255, 255, 255, 0) 70%)' }}></div>

            <header>
                <div className="logo-wrapper">
                    <div className="logo-icon">Ψ</div>
                    <span className="app-title">HeartSpace by DNA AI</span>
                </div>
                <nav>
                    <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>Trang chủ</Link>
                    <Link to="/chatbot" className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}>AI Tâm Lý</Link>
                    <Link to="/mbti" className={`nav-link ${location.pathname === '/mbti' ? 'active' : ''}`}>Trắc nghiệm MBTI</Link>
                    <Link to="/test" className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}>Đánh giá</Link>
                    <Link to="/emotion" className={`nav-link ${location.pathname === '/emotion' ? 'active' : ''}`}>Thư giãn</Link>
                </nav>
            </header>

            <main className="fade-in">
                {children}
            </main>

            <footer>
                <p>© 2026 HeartSpace by DNA AI</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Mọi thông tin trao đổi đều mang tính chất tham khảo và hỗ trợ giải tỏa cảm xúc.</p>
            </footer>
        </div>
    );
};

export default Layout;
