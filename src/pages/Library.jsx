import React, { useState } from 'react';

const categories = ['Tất cả', 'Tâm lý học', 'Kỹ năng sống', 'Phát triển bản thân', 'Sức khỏe'];

const articlesData = [
    { category: 'Tâm lý học', title: 'Hiểu về các loại cảm xúc', desc: 'Làm thế nào để nhận diện và chấp nhận mọi cảm xúc của bản thân, từ vui vẻ đến lo âu.', color: '#ede9fe', icon: '🧠', readTime: '5 phút' },
    { category: 'Kỹ năng sống', title: 'Vượt qua áp lực đồng trang lứa', desc: 'Bí quyết để giữ vững bản lĩnh và không bị ảnh hưởng bởi kỳ vọng quá cao từ bạn bè xung quanh.', color: '#e0e7ff', icon: '💪', readTime: '7 phút' },
    { category: 'Phát triển bản thân', title: 'Sức mạnh của lòng biết ơn', desc: 'Tại sao việc thực hành lòng biết ơn mỗi ngày có thể thay đổi cách não bộ bạn vận hành.', color: '#fdf2f8', icon: '✨', readTime: '6 phút' },
    { category: 'Sức khỏe', title: 'Giấc ngủ và Sức khỏe tinh thần', desc: 'Mối liên hệ mật thiết giữa chất lượng giấc ngủ và khả năng điều tiết cảm xúc của bạn.', color: '#ecfdf5', icon: '🌙', readTime: '8 phút' },
    { category: 'Tâm lý học', title: 'Tư duy phát triển (Growth Mindset)', desc: 'Cách thay đổi góc nhìn về những thất bại để biến chúng thành cơ hội học hỏi quý giá.', color: '#fff7ed', icon: '🌱', readTime: '5 phút' },
    { category: 'Kỹ năng sống', title: 'Quản lý thời gian hiệu quả', desc: 'Phương pháp Pomodoro và ma trận Eisenhower giúp bạn giảm bớt căng thẳng khi học tập.', color: '#f0f9ff', icon: '⏱️', readTime: '4 phút' }
];

const Library = () => {
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    const filteredArticles = activeCategory === 'Tất cả'
        ? articlesData
        : articlesData.filter(a => a.category === activeCategory);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1rem 0' }} className="library-container mobile-padding-0">
            <header style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 8vw, 4rem)', padding: '0 1rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.25rem, 8vw, 3.5rem)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Thư Viện Kiến Thức</h2>
                <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                    Tổng hợp kiến thức giúp bạn hiểu rõ hơn về chính mình.
                </p>

                {/* Category Filter */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0 0.5rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: activeCategory === cat ? 'var(--primary)' : 'white',
                                color: activeCategory === cat ? 'white' : 'var(--text-light)',
                                fontWeight: '700',
                                fontSize: 'clamp(0.8125rem, 3vw, 0.9375rem)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: activeCategory === cat ? '0 10px 20px -5px rgba(139, 92, 246, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                fontFamily: 'Plus Jakarta Sans, sans-serif'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', padding: '0 1rem' }}>
                {filteredArticles.map((article, i) => (
                    <div key={i} className="glass-card overflow-hidden library-article-card" style={{ cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', padding: 0 }}>
                        <div style={{ height: 'clamp(180px, 30vw, 220px)', background: article.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(3rem, 10vw, 5rem)', transition: 'transform 0.5s' }}>
                            {article.icon}
                        </div>
                        <div style={{ padding: 'clamp(1.5rem, 5vw, 2.25rem)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(139, 92, 246, 0.1)', padding: '0.25rem 0.625rem', borderRadius: '999px' }}>
                                    {article.category}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    ⏱️ {article.readTime}
                                </span>
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', fontWeight: '800', marginBottom: '0.75rem', color: '#1e293b', lineHeight: '1.3' }}>{article.title}</h3>
                            <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>{article.desc}</p>
                            <button className="read-more-btn" style={{ marginTop: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, width: 'fit-content' }}>
                                Đọc bài viết <span style={{ transition: 'transform 0.2s' }}>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .glass-card:hover h3 { color: var(--primary); }
                .glass-card:hover .read-more-btn span { transform: translateX(5px); }
                .glass-card:hover div:first-child { transform: scale(1.05); }

                @media (max-width: 768px) {
                    .library-article-card { border-radius: 1.5rem; }
                    .library-container { padding: 0; }
                }
            `}</style>
        </div>
    );
};

export default Library;
