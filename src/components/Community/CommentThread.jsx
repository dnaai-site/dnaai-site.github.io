import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComments, useReplies } from '../../hooks/useComments';
import { useMentions } from '../../hooks/useMentions';
import { useAIResponder } from '../../hooks/useAIResponder';
import { rtdb } from '../../services/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import MentionSuggestions from './MentionSuggestions';

const CommentItem = ({ comment, depth = 0, isLast = false, postId }) => {
    const { user, userProfile } = useAuth();
    const { replies } = useReplies(comment.id);
    const { suggestions, showSuggestions, handleInputChange, setShowSuggestions } = useMentions();
    const { respondToPost } = useAIResponder();

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const inputRef = useRef(null);

    const handleReply = async (e) => {
        e.preventDefault();
        const text = replyText.trim();
        if (!text || !user) return;

        const repliesRef = ref(rtdb, `replies/${comment.id}`);
        const newReplyRef = push(repliesRef);

        await set(newReplyRef, {
            id: newReplyRef.key,
            text,
            authorId: user.uid,
            authorName: userProfile?.username || 'Người dùng',
            authorPhotoURL: userProfile?.photoURL || '',
            createdAt: serverTimestamp(),
            depth: depth + 1
        });

        setReplyText('');
        setShowReplyInput(false);

        // Trigger AI responding to the thread after this reply
        respondToPost(postId, text);
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setReplyText(val);
        handleInputChange(val, e.target.selectionEnd || val.length);
    };

    const handleSelectMention = (username) => {
        const cursorPosition = inputRef.current.selectionStart;
        const textBeforeCursor = replyText.substring(0, cursorPosition);
        const textAfterCursor = replyText.substring(cursorPosition);
        const newText = textBeforeCursor.replace(/@\w*$/, `@${username} `) + textAfterCursor;
        setReplyText(newText);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    if (depth > 2) return null; // Limit to 3 levels

    return (
        <div className="relative mb-6">
            {/* Thread Line */}
            {!isLast && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-50/50" />
            )}

            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-xs text-gray-400 overflow-hidden ring-2 ring-white shadow-sm">
                    {comment.authorPhotoURL ? (
                        <img src={comment.authorPhotoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white ${comment.isAI ? 'bg-indigo-500' : 'bg-gray-400'}`}>
                            {comment.isAI ? '✨' : (comment.authorName?.[0] || 'U').toUpperCase()}
                        </div>
                    )}
                </div>

                <div className={`flex-1 rounded-2xl p-3 border transition-all ${comment.isAI ? 'bg-indigo-50/30 border-indigo-100 shadow-sm shadow-indigo-50' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <span className={`font-black text-xs ${comment.isAI ? 'text-indigo-600 uppercase tracking-tight' : 'text-gray-900'}`}>{comment.authorName}</span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium leading-[1.5]">{comment.text}</p>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-500 transition-colors"
                        >
                            {showReplyInput ? 'Đóng' : 'Trả lời'}
                        </button>
                    </div>
                </div>
            </div>

            {showReplyInput && (
                <div className="ml-11 mt-3 relative">
                    <form onSubmit={handleReply} className="flex gap-2 bg-white rounded-full border border-gray-100 p-1 pl-4 shadow-sm focus-within:border-indigo-200 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            autoFocus
                            value={replyText}
                            onChange={handleTextChange}
                            placeholder={`Trả lời ${comment.authorName}...`}
                            className="flex-1 bg-transparent text-sm outline-none font-medium py-1.5"
                        />
                        <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="bg-gray-900 text-white font-black text-xs px-4 py-1.5 rounded-full disabled:opacity-30 transition-all active:scale-95"
                        >
                            Gửi
                        </button>
                    </form>

                    {showSuggestions && (
                        <MentionSuggestions
                            suggestions={suggestions}
                            onSelect={handleSelectMention}
                            position={{ bottom: '100%', left: 0 }}
                        />
                    )}
                </div>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="ml-8 mt-4 border-l-2 border-gray-50/50 pl-3">
                    {replies.map((reply, index) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            isLast={index === replies.length - 1}
                            postId={postId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentThread = ({ postId }) => {
    const { user, userProfile } = useAuth();
    const { comments, loading } = useComments(postId);
    const { suggestions, showSuggestions, handleInputChange, setShowSuggestions } = useMentions();
    const { respondToPost } = useAIResponder();

    const [newComment, setNewComment] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = newComment.trim();
        if (!text || !user) return;

        const commentsRef = ref(rtdb, `comments/${postId}`);
        const newCommentRef = push(commentsRef);

        await set(newCommentRef, {
            id: newCommentRef.key,
            text,
            authorId: user.uid,
            authorName: userProfile?.username || 'Người dùng',
            authorPhotoURL: userProfile?.photoURL || '',
            createdAt: serverTimestamp(),
            depth: 0
        });

        setNewComment('');

        // Trigger AI responder
        respondToPost(postId, text);
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setNewComment(val);
        handleInputChange(val, e.target.selectionEnd || val.length);
    };

    const handleSelectMention = (username) => {
        const cursorPosition = inputRef.current.selectionStart;
        const textBeforeCursor = newComment.substring(0, cursorPosition);
        const textAfterCursor = newComment.substring(cursorPosition);
        const newText = textBeforeCursor.replace(/@\w*$/, `@${username} `) + textAfterCursor;
        setNewComment(newText);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    return (
        <div className="mt-2 pl-4 border-l-2 border-gray-50/50">
            {loading ? (
                <div className="space-y-4 py-2">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-100 rounded-full" />
                            <div className="flex-1 h-12 bg-gray-50 rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment, index) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            isLast={index === comments.length - 1}
                            postId={postId}
                        />
                    ))}
                </div>
            )}

            {user && (
                <div className="mt-6 relative">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-center bg-gray-50/50 rounded-3xl p-1.5 pl-5 border border-gray-100/50 focus-within:bg-white focus-within:border-indigo-100 transition-all shadow-sm">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={handleTextChange}
                            placeholder="Trả lời thread này..."
                            className="flex-1 bg-transparent text-sm outline-none font-medium py-2"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-gray-900 text-white font-black text-xs px-5 py-2.5 rounded-full disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                        >
                            Đăng
                        </button>
                    </form>

                    {showSuggestions && (
                        <MentionSuggestions
                            suggestions={suggestions}
                            onSelect={handleSelectMention}
                            position={{ bottom: '100%', left: 0 }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentThread;
