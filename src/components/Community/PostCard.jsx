import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toggleLikeRTDBPost, followRTDBUser, unfollowRTDBUser } from '../../services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import CommentThread from './CommentThread';

const IconHeart = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#ef4444" : "none"} stroke={active ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const IconMessage = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const PostCard = ({ post, isFollowing, onToggleFollow }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!user) return;
        try {
            await toggleLikeRTDBPost(post.id, user.uid);
        } catch (err) {
            console.error(err);
        }
    };

    const timeString = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi }) : 'vừa xong';

    return (
        <div className="flex gap-4 py-6 border-b border-gray-100/50 relative group transition-all hover:bg-gray-50/30 px-2 -mx-2 rounded-2xl animate-fade-in">
            {/* Thread Line Extension */}
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div className="relative">
                    {post.authorPhotoURL ? (
                        <div className="w-12 h-12 rounded-full ring-2 ring-white ring-offset-1 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                            <img src={post.authorPhotoURL} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl ring-2 ring-white ring-offset-1 shadow-sm transition-transform group-hover:scale-105">
                            {(post.authorName?.[0] || 'U').toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-gray-200 to-gray-50 mt-3 mb-1 rounded-full group-last:hidden" />
            </div>

            <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-[15px] text-gray-900 tracking-tight hover:underline cursor-pointer">{post.authorName}</span>
                        {user && post.authorId !== user.uid && (
                            <button
                                onClick={() => onToggleFollow(post.authorId, isFollowing)}
                                className={`text-[12px] font-black px-3 py-0.5 rounded-full border transition-all ${isFollowing
                                        ? 'bg-gray-50 text-gray-400 border-gray-100'
                                        : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 active:scale-90 shadow-sm'
                                    }`}
                            >
                                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                            </button>
                        )}
                        <span className="text-gray-300 mx-0.5">•</span>
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{timeString}</span>
                    </div>
                </div>

                <p className="text-gray-800 text-[16px] leading-[1.6] mb-4 whitespace-pre-wrap font-medium">
                    {post.text}
                </p>

                <div className="flex gap-6 text-gray-400">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 ${post.likesCount > 0 ? 'text-red-500' : 'hover:text-red-400'}`}
                    >
                        <IconHeart active={post.likesCount > 0} />
                        {post.likesCount > 0 && <span className="text-xs font-black">{post.likesCount}</span>}
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 ${showComments ? 'text-indigo-600' : 'hover:text-indigo-400'}`}
                    >
                        <IconMessage />
                        <span className="text-xs font-black">{post.commentCount || 0}</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-6 border-t border-gray-50 pt-6 animate-slide-down">
                        <CommentThread postId={post.id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
