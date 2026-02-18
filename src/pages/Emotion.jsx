import React, { useState } from 'react';

const Emotion = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
            <h2 className="hero-gradient-text" style={{ fontSize: '3rem', fontWeight: '800', textAlign: 'center', marginBottom: '4rem' }}>Góc Bình Yên</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Breathing Exercise */}
                <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hít thở sâu</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '0.9375rem' }}>Theo nhịp vòng tròn để giải tỏa căng thẳng</p>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
                        <div className="breathing-circle"></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                        <span>Hít vào (4s)</span>
                        <span>Thở ra (4s)</span>
                    </div>
                </div>

                {/* Music Options */}
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Giai điệu thư giãn</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { title: 'Tiếng mưa rơi', desc: 'Âm thanh tự nhiên', active: true },
                            { title: 'Sóng biển rì rào', desc: 'Thư giãn sâu', active: false },
                            { title: 'Piano không lời', desc: 'Tăng sự tập trung', active: false }
                        ].map((track, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                padding: '1.25rem',
                                background: track.active ? 'rgba(139, 92, 246, 0.05)' : 'white',
                                borderRadius: '1.25rem',
                                border: track.active ? '2px solid #ddd6fe' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ width: '3rem', height: '3rem', background: track.active ? 'var(--primary)' : '#f1f5f9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: track.active ? 'white' : '#94a3b8' }}>
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '1rem' }}>{track.title}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{track.desc}</div>
                                </div>
                                {track.active && (
                                    <div className="playing-bars">
                                        <span></span><span></span><span></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Exercises */}
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Bài tập tâm trí</h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { icon: '🧘', text: 'Quan sát hơi thở trong 10 nhịp' },
                            { icon: '🙆', text: 'Thả lỏng cơ bắp từ vùng vai' },
                            { icon: '✍️', text: 'Viết ra 3 điều biết ơn hôm nay' },
                            { icon: '🦶', text: 'Cảm nhận sự tiếp xúc của đôi chân' }
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                                <span style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`
        .breathing-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--primary-light), var(--primary));
          animation: circleBreathe 8s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
        }
        @keyframes circleBreathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 1; }
        }
        .playing-bars { display: flex; align-items: flex-end; gap: 3px; height: 16px; }
        .playing-bars span { width: 3px; background: var(--primary); animation: barGrow 1s infinite ease-in-out; }
        .playing-bars span:nth-child(1) { height: 100%; animation-delay: 0s; }
        .playing-bars span:nth-child(2) { height: 60%; animation-delay: 0.2s; }
        .playing-bars span:nth-child(3) { height: 80%; animation-delay: 0.4s; }
        @keyframes barGrow { 0%, 100% { height: 40%; } 50% { height: 100%; } }
      `}</style>
        </div>
    );
};

export default Emotion;
