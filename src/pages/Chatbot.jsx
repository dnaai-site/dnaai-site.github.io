import React, { useState, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../services/gemini';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Chào bạn, mình là trợ lý AI của HeartSpace. Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ với mình nhé.' }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Get conversation history for context (last 10 messages)
            const history = messages.slice(-10);
            const aiResponseText = await getGeminiResponse(currentInput, history);

            setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Mình hơi bối rối một chút, bạn có thể nói lại được không?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <div className="glass-card overflow-hidden" style={{ minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', background: 'white' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Người bạn đồng hành AI</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Mọi bí mật của bạn đều được bảo mật tuyệt đối</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            maxWidth: '80%',
                            padding: '1rem 1.25rem',
                            borderRadius: '1.5rem',
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                            background: msg.role === 'ai' ? 'white' : 'var(--primary)',
                            color: msg.role === 'ai' ? '#1e293b' : 'white',
                            borderBottomLeftRadius: msg.role === 'ai' ? '0.25rem' : '1.5rem',
                            borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.5rem',
                            boxShadow: msg.role === 'ai' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 10px 15px -3px rgba(139, 92, 246, 0.3)'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{
                            alignSelf: 'flex-start',
                            background: 'white',
                            padding: '1rem 1.25rem',
                            borderRadius: '1.5rem',
                            borderBottomLeftRadius: '0.25rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <div className="typing-loader">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "AI đang suy nghĩ..." : "Hôm nay bạn thế nào? Chia sẻ cùng mình nhé..."}
                        style={{
                            flex: 1,
                            border: '2px solid #f1f5f9',
                            borderRadius: '999px',
                            padding: '0.875rem 1.5rem',
                            outline: 'none',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ padding: '0 2rem', borderRadius: '999px', opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? "..." : "Gửi"}
                    </button>
                </form>
            </div>

            <style>{`
                .typing-loader { display: flex; gap: 4px; }
                .typing-loader span {
                    width: 8px; height: 8px; background: var(--primary);
                    border-radius: 50%; opacity: 0.4;
                    animation: typing 1s infinite ease-in-out;
                }
                .typing-loader span:nth-child(2) { animation-delay: 0.2s; }
                .typing-loader span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Chatbot;
