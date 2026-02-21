import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const samplePosts = [
    {
        id: 1,
        initial: 'T',
        text: 'Hôm nay mình cảm thấy rất áp lực về việc học tập. Đôi khi mình tự hỏi liệu mình có đang đi đúng hướng không... Nhưng rồi mình nhớ ra rằng mỗi người có một tốc độ riêng của mình. 💪',
        time: '2 giờ trước',
        likes: 12,
        comments: 5,
        liked: false
    },
    {
        id: 2,
        initial: 'M',
        text: 'Mình vừa hoàn thành một bài thi quan trọng. Cảm thấy nhẹ lòng hơn rất nhiều. Cảm ơn HeartSpace đã đồng hành cùng mình những ngày qua! 🌟',
        time: '5 giờ trước',
        likes: 24,
        comments: 8,
        liked: false
    },
    {
        id: 3,
        initial: 'H',
        text: 'Mình hay tự so sánh bản thân với người khác và cảm thấy rất mệt. Bạn nào có mẹo để vượt qua áp lực peer pressure không? 🙏',
        time: '1 ngày trước',
        likes: 31,
        comments: 15,
        liked: true
    }
];

const Community = () => {
    const { user, userProfile } = useAuth();
    const [posts, setPosts] = useState(samplePosts);
    const [newPost, setNewPost] = useState('');
    const [posting, setPosting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const maxChars = 500;

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        setPosting(true);
        await new Promise(r => setTimeout(r, 600));

        const post = {
            id: Date.now(),
            initial: (userProfile?.username || 'B')[0].toUpperCase(),
            text: newPost.trim(),
            time: 'Vừa xong',
            likes: 0,
            comments: 0,
            liked: false,
            isOwn: true
        };
        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setPosting(false);
        setShowForm(false);
    };

    const handleLike = (id) => {
        setPosts(prev => prev.map(p =>
            p.id === id
                ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                : p
        ));
    };

    const colors = ['#8b5cf6', '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
    const getColor = (id) => colors[id % colors.length];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                    Cộng Đồng Chia Sẻ
                </h2>
                <p style={{ fontSize: '1.0625rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
                    Nơi bạn có thể chia sẻ cảm xúc ẩn danh và nhận sự đồng cảm từ cộng đồng.
                </p>
            </div>

            {/* Write Post Button / Form */}
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
                {!showForm ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                            {user ? (userProfile?.username || 'B')[0].toUpperCase() : 'Ẩ'}
                        </div>
                        {user ? (
                            <button
                                onClick={() => setShowForm(true)}
                                style={{ flex: 1, padding: '0.875rem 1.25rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '999px', textAlign: 'left', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9375rem', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#faf5ff'; }}
                                onMouseOut={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            >
                                Hôm nay bạn cảm thấy thế nào? Chia sẻ với cộng đồng...
                            </button>
                        ) : (
                            <div style={{ flex: 1 }}>
                                <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Đăng nhập</Link> để chia sẻ câu chuyện của bạn với cộng đồng.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handlePost}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                                {(userProfile?.username || 'B')[0].toUpperCase()}
                            </div>
                            <textarea
                                value={newPost}
                                onChange={e => setNewPost(e.target.value.slice(0, maxChars))}
                                placeholder="Chia sẻ cảm xúc, suy nghĩ hay câu chuyện của bạn... (ẩn danh)"
                                autoFocus
                                rows={4}
                                style={{ flex: 1, padding: '0.875rem', border: '2px solid #e2e8f0', borderRadius: '1rem', fontSize: '0.9375rem', resize: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#1e293b', lineHeight: '1.6' }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{newPost.length}/{maxChars} ký tự</span>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" onClick={() => { setShowForm(false); setNewPost(''); }} className="btn" style={{ padding: '0.625rem 1.25rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={!newPost.trim() || posting} style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem' }}>
                                    {posting ? 'Đang đăng...' : '✍️ Đăng bài'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Community Guidelines */}
            <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '1rem', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <p style={{ fontSize: '0.875rem', color: '#6d28d9', fontWeight: '600', lineHeight: '1.5' }}>
                    Cộng đồng ẩn danh và an toàn. Mọi bài đăng đều không tiết lộ danh tính thật. Hãy chia sẻ với sự tôn trọng và đồng cảm.
                </p>
            </div>

            {/* Posts Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {posts.map((post) => (
                    <div key={post.id} className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', background: getColor(post.id), color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                                {post.initial}
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9375rem' }}>
                                    Người dùng ẩn danh
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{post.time}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#475569', marginBottom: '1.5rem' }}>{post.text}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                            <button
                                onClick={() => handleLike(post.id)}
                                style={{
                                    background: 'none', border: 'none',
                                    color: post.liked ? '#ef4444' : '#94a3b8',
                                    fontWeight: '700', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.9375rem', transition: 'all 0.2s',
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    transform: post.liked ? 'scale(1.05)' : 'scale(1)'
                                }}
                            >
                                {post.liked ? '❤️' : '🤍'} {post.likes} Thích
                            </button>
                            <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                💬 {post.comments} Bình luận
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
