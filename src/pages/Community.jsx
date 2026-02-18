import React, { useState } from 'react';

const Community = () => {
    const [posts, setPosts] = useState([
        { id: 1, user: 'A1', text: 'Hôm nay mình cảm thấy rất áp lực về việc học tập. Đôi khi mình tự hỏi liệu mình có đang đi đúng hướng không...', time: '2 giờ trước', likes: 12, comments: 5 },
        { id: 2, user: 'A2', text: 'Mình vừa hoàn thành một bài thi quan trọng. Cảm thấy nhẹ lòng hơn rất nhiều. Cảm ơn HeartSpace đã đồng hành cùng mình những ngày qua!', time: '5 giờ trước', likes: 24, comments: 8 }
    ]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Cộng Đồng Chia Sẻ</h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-light)' }}>Nơi bạn có thể chia sẻ câu chuyện của mình ẩn danh và nhận sự đồng cảm.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {posts.map((post) => (
                    <div key={post.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '3rem', height: '3rem', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem' }}>
                                {post.user}
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', color: '#1e293b' }}>Người dùng ẩn danh</div>
                                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{post.time}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569', marginBottom: '2rem' }}>{post.text}</p>
                        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                            <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
                                ❤️ {post.likes} Thích
                            </button>
                            <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}>
                                💬 {post.comments} Bình luận
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Viết câu chuyện của bạn</button>
            </div>
        </div>
    );
};

export default Community;
