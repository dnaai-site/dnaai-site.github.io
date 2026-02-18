import React from 'react';
import { Link } from 'react-router-dom';

const Career = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🚀</div>
                <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>Khám Phá Nghề Nghiệp</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '3rem', lineHeight: '1.7' }}>
                    Tính năng này đang được phát triển để giúp bạn tìm thấy con đường sự nghiệp phù hợp nhất với bản thân dựa trên 16 nhóm tính cách.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <Link to="/mbti" className="btn btn-primary" style={{ padding: '1rem 2.5rem', textDecoration: 'none' }}>Làm bài test MBTI trước</Link>
                    <Link to="/" className="btn" style={{ padding: '1rem 2.5rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', textDecoration: 'none' }}>Quay lại trang chủ</Link>
                </div>
            </div>
        </div>
    );
};

export default Career;
