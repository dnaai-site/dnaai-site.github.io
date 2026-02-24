import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container" style={{ padding: '1rem 0' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span className="badge" style={{
                    display: 'inline-block',
                    padding: '0.375rem 1rem',
                    borderRadius: '999px',
                    background: '#ede9fe',
                    color: '#7c3aed',
                    fontSize: 'min(0.8125rem, 3.5vw)',
                    fontWeight: '700',
                    marginBottom: '1.25rem',
                    border: '1px solid #ddd6fe'
                }}>
                    ✨ Khám phá thế giới nội tâm của bạn
                </span>
                <h1 className="hero-gradient-text" style={{
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    marginBottom: '1.25rem',
                    letterSpacing: '-0.02em'
                }}>
                    Thấu hiểu bản thân,<br />Kiến tạo hạnh phúc.
                </h1>
                <p style={{
                    fontSize: 'clamp(0.9375rem, 4vw, 1.125rem)',
                    color: 'var(--text-light)',
                    marginBottom: '2rem',
                    maxWidth: '42rem',
                    margin: '0 auto 2rem auto',
                    lineHeight: '1.6',
                    padding: '0 1rem'
                }}>
                    HeartSpace là người bạn đồng hành AI giúp bạn vượt qua áp lực, thấu hiểu cảm xúc và tìm thấy sự bình yên trong tâm hồn.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0 1rem' }}>
                    <Link to="/chatbot" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', textDecoration: 'none', minWidth: '200px' }}>
                        Bắt đầu ngay
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginLeft: '8px' }}>
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <Link to="/chatbot" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>AI Tâm Lý</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Trò chuyện 24/7 với trợ lý ảo. Chia sẻ cảm xúc và nhận những lời khuyên tích cực.</p>
                </Link>
                <Link to="/mbti" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Trắc Nghiệm MBTI</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Khám phá 16 nhóm tính cách để hiểu rõ bản thân và định hướng sự nghiệp.</p>
                </Link>
                <Link to="/test" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Đánh Giá Tâm Lý</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Sử dụng bài trắc nghiệm nhanh để theo dõi mức độ căng thẳng của bạn.</p>
                </Link>
                <Link to="/emotion" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Quản Lý Cảm Xúc</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Các bài tập hít thở, thiền định giúp bạn giải tỏa căng thẳng ngay lập tức.</p>
                </Link>
                <Link to="/career" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Hướng Nghiệp AI</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>AI phân tích tính cách và gợi ý ngành nghề phù hợp nhất với bạn.</p>
                </Link>
                <Link to="/community" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Cộng Đồng</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Chia sẻ câu chuyện ẩn danh và nhận sự đồng cảm từ cộng đồng.</p>
                </Link>
                <Link to="/library" className="glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="tool-icon-wrapper">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Thư Viện</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Kho bài viết tâm lý học và kỹ năng sống chuyên sâu.</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;

