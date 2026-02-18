import React from 'react';

const Library = () => {
    const articles = [
        { category: 'Tâm lý học cơ bản', title: 'Hiểu về các loại cảm xúc', desc: 'Làm thế nào để nhận diện và chấp nhận mọi cảm xúc của bản thân...', color: '#ede9fe', icon: '🧠' },
        { category: 'Kỹ năng sống', title: 'Cách vượt qua áp lực đồng trang lứa', desc: 'Bí quyết để giữ vững bản lĩnh và không bị ảnh hưởng bởi kỳ vọng...', color: '#e0e7ff', icon: '💪' },
        { category: 'Phát triển bản thân', title: 'Sức mạnh của lòng biết ơn', desc: 'Tại sao việc thực hành lòng biết ơn mỗi ngày có thể thay đổi cuộc sống...', color: '#fdf2f8', icon: '✨' }
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Thư Viện Kiến Thức</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto' }}>
                    Tổng hợp các bài viết chuyên sâu về tâm lý học, kỹ năng sống và phát triển bản thân giúp bạn hiểu rõ hơn về chính mình.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {articles.map((article, i) => (
                    <div key={i} className="glass-card overflow-hidden" style={{ cursor: 'pointer', transition: 'all 0.3s' }}>
                        <div style={{ height: '200px', background: article.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                            {article.icon}
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '1rem 0', color: '#1e293b' }}>{article.title}</h3>
                            <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem' }}>{article.desc}</p>
                            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Đọc thêm <span>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
