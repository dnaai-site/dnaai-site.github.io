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
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CommentSection = ({ postId, user, userProfile }) => {
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
        const textToPost = newComment.trim();
        if (!textToPost || !user) return;
        setLoading(true);
        try {
            const commentRef = await addComment(postId, {
                text: textToPost,
                authorId: user.uid,
                authorName: userProfile?.username || user.email?.split('@')[0] || 'Người dùng'
            });

            // AI Logic for Comment
            const lowerText = textToPost.toLowerCase();
            const isTagged = lowerText.includes('@ai') || lowerText.includes('@heartai');

            if (isTagged || textToPost.length > 10) {
                const { getGeminiResponse } = await import('../services/gemini');
                const aiPrompt = isTagged
                    ? `Người dùng vừa nhắc đến bạn trong bình luận: "${textToPost}". Hãy trả lời họ.`
                    : `Phân tích bình luận này: "${textToPost}". Nếu bình luận này mang tính tiêu cực, buồn bã hoặc cần sự đồng cảm, hãy viết một phản hồi ngắn gọn (dưới 50 từ) để an ủi họ. Nếu không cần thiết, hãy trả lời chính xác từ "NONE".`;

                const aiResponse = await getGeminiResponse(aiPrompt);
                if (aiResponse && aiResponse.trim() !== "NONE") {
                    await addComment(postId, {
                        text: aiResponse,
                        authorId: 'ai-bot',
                        authorName: 'HeartAI ✨',
                        isAI: true
                    });
                }
            }

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
                {comments.length === 0 && (
                    <div style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center', padding: '0.5rem' }}>Chưa có bình luận nào.</div>
                )}
                {comments.map(c => (
                    <div key={c.id} style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', gap: '0.5rem', background: c.isAI ? 'rgba(139, 92, 246, 0.05)' : 'transparent', padding: c.isAI ? '0.5rem' : '0', borderRadius: '0.5rem' }}>
                        <div style={{ width: '1.75rem', height: '1.75rem', background: c.isAI ? 'var(--primary)' : 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.6875rem', flexShrink: 0 }}>
                            {c.isAI ? '✨' : (c.authorName || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                            <span style={{ fontWeight: '700', color: c.isAI ? 'var(--primary)' : '#1e293b', marginRight: '0.375rem' }}>{c.authorName || 'Ẩn danh'}:</span>
                            {c.text}
                        </div>
                    </div>
                ))}
            </div>
            {user ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        style={{ flex: 1, padding: '0.5rem 0.875rem', borderRadius: '99px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button type="submit" disabled={loading || !newComment.trim()} style={{ background: 'var(--primary)', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer', borderRadius: '99px', padding: '0.5rem 1rem', fontSize: '0.8125rem', opacity: !newComment.trim() ? 0.5 : 1, transition: 'opacity 0.2s' }}>Gửi</button>
                </form>
            ) : (
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Đăng nhập</Link> để bình luận
                </p>
            )}
        </div>
    );
};

const Community = () => {
    const { user, userProfile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [posting, setPosting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [activeComments, setActiveComments] = useState({});
    const [postError, setPostError] = useState('');

    const maxChars = 500;

    useEffect(() => {
        if (!db) {
            setLoadingPosts(false);
            return;
        }
        const unsubscribe = subscribeToPosts((data) => {
            setPosts(data);
            setLoadingPosts(false);
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        const textToPost = newPost.trim();
        if (!textToPost || !user) return;
        setPosting(true);
        setPostError('');
        try {
            const displayName = isAnonymous ? 'Người dùng ẩn danh' : (userProfile?.username || user.email?.split('@')[0] || 'Ẩn danh');
            const authorPhotoURL = isAnonymous ? '' : (userProfile?.photoURL || '');
            const postRef = await createPost({
                text: textToPost,
                authorId: user.uid,
                authorName: displayName,
                authorPhotoURL: authorPhotoURL,
                isAnonymous: isAnonymous
            });

            // AI Logic for Post
            const lowerText = textToPost.toLowerCase();
            const isTagged = lowerText.includes('@ai') || lowerText.includes('@heartai');

            if (isTagged || textToPost.length > 20) {
                const { getGeminiResponse } = await import('../services/gemini');
                const aiPrompt = isTagged
                    ? `Người dùng vừa đăng bài và nhắc đến bạn: "${textToPost}". Hãy trả lời họ dưới tư cách HeartAI.`
                    : `Phân tích bài đăng này: "${textToPost}". Nếu bài đăng này thể hiện sự cô đơn, buồn bã, áp lực hoặc cần lời khuyên tử tế, hãy viết một phản hồi chân thành (dưới 100 từ). Nếu không cần thiết, hãy trả lời chính xác từ "NONE".`;

                const aiResponse = await getGeminiResponse(aiPrompt);
                if (aiResponse && aiResponse.trim() !== "NONE") {
                    await addComment(postRef.id, {
                        text: aiResponse,
                        authorId: 'ai-bot',
                        authorName: 'HeartAI ✨',
                        isAI: true
                    });
                }
            }

            setNewPost('');
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setPostError('Đăng bài thất bại. Vui lòng thử lại.');
        } finally {
            setPosting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        try {
            const { deletePost } = await import('../services/firebase');
            await deletePost(postId, user.uid);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLike = async (postId) => {
        if (!user) return;
        try {
            await toggleLikePost(postId, user.uid);
        } catch (err) {
            console.error('Like error:', err);
        }
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
                {loadingPosts && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '2rem', height: '2rem', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Đang tải bài viết...
                    </div>
                )}
                {!loadingPosts && posts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        Chưa có bài đăng nào. Hãy là người đầu tiên chia sẻ! 💬
                    </div>
                )}
                {posts.map((post) => (
                    <div key={post.id} className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                            {post.authorPhotoURL ? (
                                <img
                                    src={post.authorPhotoURL}
                                    alt={post.authorName}
                                    style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                />
                            ) : (
                                <div style={{ width: '2.75rem', height: '2.75rem', background: getColor(post.authorName?.[0] || 'A'), color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.125rem', flexShrink: 0 }}>
                                    {(post.authorName?.[0] || 'A').toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    {post.authorName}
                                    {post.authorId === 'ai-bot' && <span style={{ fontSize: '0.75rem' }}>✨</span>}
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                                    {post.createdAt?.toDate().toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            {user && post.authorId === user.uid && (
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.125rem', padding: '0.5rem' }}
                                    title="Xóa bài viết"
                                >
                                    🗑️
                                </button>
                            )}
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
                            {user && post.authorId !== user.uid && post.authorId !== 'ai-bot' && (
                                <Link
                                    to={`/messages/${post.authorId}`}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', textDecoration: 'none' }}
                                >
                                    ✉️ Nhắn tin
                                </Link>
                            )}
                            {user && post.authorId !== user.uid && (
                                <button
                                    onClick={async () => {
                                        const reason = prompt("Lý do báo cáo vi phạm:");
                                        if (reason) {
                                            const { reportUser } = await import('../services/firebase');
                                            const reportRef = await reportUser(user.uid, post.authorId, reason, post.text);
                                            alert("Đã gửi báo cáo. Cảm ơn bạn đã hỗ trợ cộng đồng!");

                                            // Trigger AI check right away for the report (background)
                                            try {
                                                const { getGeminiResponse } = await import('../services/gemini');
                                                const aiPrompt = `Phân tích báo cáo vi phạm sau:
                                                Lý do báo cáo: "${reason}"
                                                Nội dung bài viết: "${post.text}"
                                                Hãy cho biết nội dung này có vi phạm tiêu chuẩn cộng đồng không. Trả lời: "VI PHẠM" hoặc "KHÔNG VI PHẠM" và 1 câu giải thích.`;
                                                const analysis = await getGeminiResponse(aiPrompt);

                                                const { db } = await import('../services/firebase');
                                                const { doc, updateDoc } = await import('firebase/firestore');
                                                await updateDoc(doc(db, "reports", reportRef.id), {
                                                    aiAnalysis: analysis,
                                                    status: 'reviewed'
                                                });
                                            } catch (aiErr) {
                                                console.error("AI Analysis failed:", aiErr);
                                            }
                                        }
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '0.8125rem', marginLeft: 'auto' }}
                                    onMouseOver={e => e.target.style.color = '#ef4444'}
                                    onMouseOut={e => e.target.style.color = '#94a3b8'}
                                >
                                    🚩 Báo cáo
                                </button>
                            )}
                        </div>
                        {activeComments[post.id] && <CommentSection postId={post.id} user={user} userProfile={userProfile} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
