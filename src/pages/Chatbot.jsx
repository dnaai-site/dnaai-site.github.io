import React, { useState, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../services/gemini';

const suggestions = [
    { label: 'Cảm thấy stress', text: 'Mình đang cảm thấy rất stress về việc học tập, bạn có thể giúp mình không?' },
    { label: 'Khó ngủ', text: 'Dạo này mình hay bị mất ngủ, có cách nào để cải thiện không?' },
    { label: 'Áp lực đồng trang lứa', text: 'Mình hay tự so sánh bản thân với bạn bè và thấy rất tự ti.' },
    { label: 'Muốn thư giãn', text: 'Mình mệt mỏi quá, hãy chỉ cho mình vài cách thư giãn nhanh nhé.' }
];

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Chào bạn, mình là người bạn đồng hành AI của HeartSpace. Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ với mình bất cứ điều gì đang làm bạn bận lòng nhé.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = { role: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const history = messages.slice(-10);
            const aiResponseText = await getGeminiResponse(text, history);
            setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Mình hơi bối rối một chút, bạn có thể nói lại được không? Hoặc thử kiểm tra kết nối mạng nhé." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = input;
        setInput('');
        sendMessage(text);
    };

    const handleSuggestion = (text) => {
        sendMessage(text);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }} className="mobile-padding-0">
            <div className="glass-card overflow-hidden chatbot-main-card" style={{
                minHeight: 'calc(100vh - 250px)',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.7)',
                padding: 0
            }}>
                {/* Chat Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--primary)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)', flexShrink: 0 }}>✨</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.125rem' }}>Trợ Lý Tâm Hồn AI</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Sẵn sàng lắng nghe bạn</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(248, 250, 252, 0.5)' }} className="messages-area">
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            maxWidth: '90%',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '1.25rem',
                            fontSize: '0.9375rem',
                            lineHeight: '1.6',
                            alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                            background: msg.role === 'ai' ? 'white' : 'var(--primary)',
                            color: msg.role === 'ai' ? '#1e293b' : 'white',
                            borderBottomLeftRadius: msg.role === 'ai' ? '0.25rem' : '1.25rem',
                            borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.25rem',
                            boxShadow: msg.role === 'ai' ? '0 4px 15px -5px rgba(0,0,0,0.05)' : '0 8px 20px -5px rgba(139, 92, 246, 0.25)',
                            border: msg.role === 'ai' ? '1px solid #f1f5f9' : 'none',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{
                            alignSelf: 'flex-start',
                            background: 'white',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '1.25rem',
                            borderBottomLeftRadius: '0.25rem',
                            boxShadow: '0 4px 15px -5px rgba(0,0,0,0.05)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div className="typing-loader">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions and Input */}
                <div style={{ padding: '1.25rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    {messages.length === 1 && !isLoading && (
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Gợi ý:</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestion(s.text)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '999px',
                                            border: '1.5px solid #ede9fe',
                                            background: 'white',
                                            color: '#6d28d9',
                                            fontSize: '0.8125rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                                        }}
                                        className="suggestion-btn"
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder={isLoading ? "Đang trả lời..." : "Hôm nay bạn thế nào?"}
                            style={{
                                flex: 1,
                                border: '2px solid #f1f5f9',
                                borderRadius: '1rem',
                                padding: '0.875rem 3.5rem 0.875rem 1.25rem',
                                outline: 'none',
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s',
                                background: '#f8fafc',
                                opacity: isLoading ? 0.7 : 1,
                                fontFamily: 'Plus Jakarta Sans, sans-serif'
                            }}
                            className="chat-input-field"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{
                                position: 'absolute',
                                right: '0.625rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '0.75rem',
                                background: input.trim() ? 'var(--primary)' : '#e2e8f0',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                cursor: input.trim() ? 'pointer' : 'default'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .typing-loader { display: flex; gap: 4px; }
                .typing-loader span {
                    width: 6px; height: 6px; background: var(--primary);
                    border-radius: 50%; opacity: 0.4;
                    animation: typing 1s infinite ease-in-out;
                }
                .typing-loader span:nth-child(2) { animation-delay: 0.2s; }
                .typing-loader span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); opacity: 1; } }
                
                .suggestion-btn:hover {
                    background: var(--primary) !important;
                    color: white !important;
                    border-color: var(--primary) !important;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .chatbot-main-card {
                        border-radius: 0;
                        border-left: none;
                        border-right: none;
                    }
                    .messages-area {
                        padding: 1rem 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
