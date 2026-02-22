import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    subscribeToPosts,
    createPost,
    toggleLikePost,
    addComment,
    subscribeToComments
} from '../services/firebase';

const CommentSection = ({ postId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToComments(postId, (data) => {
            setComments(data);
        });
        return () => unsubscribe();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        setLoading(true);
        try {
            await addComment(postId, {
                text: newComment.trim(),
                authorId: user.uid,
                authorName: 'Người dùng'
            });
            setNewComment('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {comments.map(c => (
                    <div key={c.id} style={{ fontSize: '0.875rem', color: '#475569' }}>
                        <span style={{ fontWeight: '700', color: '#1e293b' }}>Ẩn danh: </span>
                        {c.text}
                    </div>
                ))}
            </div>
            {user && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '99px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                    />
                    <button type="submit" disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Gửi</button>
                </form>
            )}
        </div>
    );
};

const Community = () => {
    const { user, userProfile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [posting, setPosting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [activeComments, setActiveComments] = useState({});

    const maxChars = 500;

    useEffect(() => {
        const unsubscribe = subscribeToPosts((data) => {
            setPosts(data);
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;
        setPosting(true);
        try {
            await createPost({
                text: newPost.trim(),
                authorId: user.uid,
                authorName: isAnonymous ? 'Người dùng ẩn danh' : (userProfile?.username || 'Ẩn danh'),
                isAnonymous: isAnonymous,
                initial: isAnonymous ? 'Ẩ' : (userProfile?.username?.[0].toUpperCase() || 'B')
            });
            setNewPost('');
            setShowForm(false);
        } catch (err) {
            console.error(err);
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (postId) => {
        if (!user) return alert('Vui lòng đăng nhập để thích bài viết.');
        await toggleLikePost(postId, user.uid);
    };

    const toggleComments = (postId) => {
        setActiveComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const colors = ['#8b5cf6', '#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
    const getColor = (initial) => colors[initial.charCodeAt(0) % colors.length];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1rem 0' }} className="community-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '800', marginBottom: '0.75rem' }}>
                    Cộng Đồng Chia Sẻ
                </h2>
                <p style={{ fontSize: 'clamp(0.9375rem, 3.5vw, 1.0625rem)', color: 'var(--text-light)', lineHeight: '1.6' }}>
                    Nơi bạn có thể chia sẻ cảm xúc và nhận sự đồng cảm từ cộng đồng.
                </p>
            </div>

            {/* Write Post Button / Form */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                {!showForm ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                            {user ? (userProfile?.username?.[0].toUpperCase() || 'B') : 'Ẩ'}
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
                                {isAnonymous ? 'Ẩ' : (userProfile?.username?.[0].toUpperCase() || 'B')}
                            </div>
                            <textarea
                                value={newPost}
                                onChange={e => setNewPost(e.target.value.slice(0, maxChars))}
                                placeholder="Chia sẻ cảm xúc, suy nghĩ hay câu chuyện của bạn..."
                                autoFocus
                                rows={4}
                                style={{ flex: 1, padding: '0.875rem', border: '2px solid #e2e8f0', borderRadius: '1rem', fontSize: '0.9375rem', resize: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#1e293b', lineHeight: '1.6' }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}>
                                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                                Đăng bài ẩn danh
                            </label>
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

            {/* Posts Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {posts.length === 0 && !posting && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        Chưa có bài đăng nào. Hãy là người đầu tiên chia sẻ!
                    </div>
                )}
                {posts.map((post) => (
                    <div key={post.id} className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', background: getColor(post.initial || 'A'), color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                                {post.initial}
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9375rem' }}>
                                    {post.authorName}
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                                    {post.createdAt?.toDate().toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#475569', marginBottom: '1.5rem' }}>{post.text}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                            <button
                                onClick={() => handleLike(post.id)}
                                style={{
                                    background: 'none', border: 'none',
                                    color: (post.likedBy || []).includes(user?.uid) ? '#ef4444' : '#94a3b8',
                                    fontWeight: '700', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.9375rem', transition: 'all 0.2s',
                                    fontFamily: 'Plus Jakarta Sans, sans-serif'
                                }}
                            >
                                {(post.likedBy || []).includes(user?.uid) ? '❤️' : '🤍'} {post.likes || 0}
                            </button>
                            <button
                                onClick={() => toggleComments(post.id)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                            >
                                💬 {post.commentCount || 0}
                            </button>
                        </div>
                        {activeComments[post.id] && <CommentSection postId={post.id} user={user} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
