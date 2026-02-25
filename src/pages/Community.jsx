import React, { useState, useEffect, useRef, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRealtimeFeed } from '../hooks/useRealtimeFeed';
import { useMentions } from '../hooks/useMentions';
import { useAIResponder } from '../hooks/useAIResponder';
import { useFollowings } from '../hooks/useFollowings';
import { createRTDBPost, followRTDBUser, unfollowRTDBUser } from '../services/firebase';
import PostCard from '../components/Community/PostCard';
import MentionSuggestions from '../components/Community/MentionSuggestions';

const Community = () => {
    const { user, userProfile } = useAuth();
    const { posts, loading: loadingFeed } = useRealtimeFeed(100);
    const { followings } = useFollowings(user?.uid);
    const { respondToPost } = useAIResponder();
    const { suggestions, showSuggestions, handleInputChange, setShowSuggestions } = useMentions();

    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const textareaRef = useRef(null);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const text = newPost.trim();
        if (!text || !user || isPosting) return;

        setIsPosting(true);
        try {
            const authorName = isAnonymous ? 'Ẩn danh' : (userProfile?.username || user.email?.split('@')[0]);
            const authorPhotoURL = isAnonymous ? '' : (userProfile?.photoURL || '');

            const postId = await createRTDBPost({
                text,
                authorId: user.uid,
                authorName,
                authorPhotoURL,
                isAnonymous
            });

            setNewPost('');
            setIsAnonymous(false);

            // Trigger AI response logic
            respondToPost(postId, text);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setNewPost(val);
        handleInputChange(val, e.target.selectionEnd || val.length);
    };

    const handleSelectMention = (username) => {
        const cursorPosition = textareaRef.current.selectionStart;
        const textBeforeCursor = newPost.substring(0, cursorPosition);
        const textAfterCursor = newPost.substring(cursorPosition);
        const newText = textBeforeCursor.replace(/@\w*$/, `@${username} `) + textAfterCursor;
        setNewPost(newText);
        setShowSuggestions(false);
        textareaRef.current.focus();
    };

    const handleToggleFollow = async (targetUid, isCurrentlyFollowing) => {
        if (!user) return;
        try {
            if (isCurrentlyFollowing) {
                await unfollowRTDBUser(user.uid, targetUid);
            } else {
                await followRTDBUser(user.uid, targetUid);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 min-h-screen pt-24 pb-20 font-sans selection:bg-indigo-100">
            {/* Header / Navbar Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100/50 flex items-center shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
                <div className="max-w-xl mx-auto w-100 px-4 flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-white font-black text-xl">H</span>
                        </div>
                        <h1 className="text-xl font-black tracking-[-0.05em] text-gray-900">HeartSpace</h1>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3 bg-gray-50/50 p-1 pr-3 rounded-full border border-gray-100 group cursor-pointer hover:bg-gray-100/50 transition-colors">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                {userProfile?.photoURL ? (
                                    <img src={userProfile.photoURL} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-black">
                                        {(userProfile?.username?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[11px] font-black text-gray-900 leading-tight">@{userProfile?.username}</p>
                                <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">{userProfile?.role}</p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-black transition-all hover:bg-gray-800 active:scale-95"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </header>

            {/* Post Creation Box */}
            <div className="mb-8 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.05)] focus-within:border-gray-200">
                <form onSubmit={handlePostSubmit}>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex-shrink-0 relative overflow-hidden ring-2 ring-gray-50 ring-offset-2">
                            {userProfile?.photoURL && !isAnonymous ? (
                                <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-lg bg-gray-50">
                                    ?
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={newPost}
                                onChange={handleTextChange}
                                placeholder="Có gì mới? Đừng giữ trong lòng nhé..."
                                className="w-full border-none outline-none text-[1.125rem] py-2 bg-transparent resize-none font-medium text-gray-800 placeholder:text-gray-300 min-h-[100px]"
                            />

                            {showSuggestions && (
                                <MentionSuggestions
                                    suggestions={suggestions}
                                    onSelect={handleSelectMention}
                                    position={{ top: '100%', left: 0 }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50/50">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isAnonymous ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                    {isAnonymous && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="hidden"
                                />
                                <span className={`text-xs font-black transition-colors ${isAnonymous ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}>Đăng ẩn danh</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!newPost.trim() || isPosting}
                            className={`group relative overflow-hidden px-8 py-2.5 rounded-full font-black text-sm transition-all shadow-sm active:scale-95 ${newPost.trim() && !isPosting
                                ? 'bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-lg'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <span className="relative z-10">{isPosting ? 'Thì thầm...' : 'Đăng thread'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed Section */}
            <div className="space-y-0 relative">
                {loadingFeed ? (
                    <div className="space-y-8 px-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-5">
                                <div className="w-12 h-12 bg-gray-100 rounded-full" />
                                <div className="flex-1 space-y-4 pt-2">
                                    <div className="h-4 bg-gray-100 rounded-full w-1/4" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-50 rounded-full w-full" />
                                        <div className="h-4 bg-gray-50 rounded-full w-2/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="animate-fade-in divide-y divide-gray-50/50">
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isFollowing={!!followings[post.authorId]}
                                onToggleFollow={handleToggleFollow}
                            />
                        ))}

                        {/* Final Glassmorphism Footer */}
                        <div className="py-20 text-center">
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">Bạn đã xem hết hôm nay</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center bg-gray-50/30 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <span className="text-2xl">🍃</span>
                        </div>
                        <p className="text-gray-900 font-black mb-1">Cánh đồng đang vắng vẻ</p>
                        <p className="text-gray-400 text-xs font-medium">Hãy là người đầu tiên gieo mầm cảm xúc nhé.</p>
                    </div>
                )}
            </div>

            {/* Floating Notification Indicator (Optional UX) */}
            {user && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        className="w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 hover:rotate-3 group"
                        onClick={() => window.location.href = '/notifications'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black group-hover:animate-bounce">
                            !
                        </div>
                    </button>
                </div>
            )}

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}</style>
        </div>
    );
};

export default Community;
