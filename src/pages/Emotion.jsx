import React, { useState, useEffect } from 'react';

const tracks = [
    { id: 1, title: 'Tiếng mưa rơi', desc: 'Âm thanh tự nhiên giúp an thần', icon: '🌧️', color: '#60a5fa' },
    { id: 2, title: 'Sóng biển rì rào', desc: 'Thư giãn sâu và giảm căng thẳng', icon: '🌊', color: '#2dd4bf' },
    { id: 3, title: 'Piano không lời', desc: 'Tăng cường sự tập trung và sáng tạo', icon: '🎹', color: '#c084fc' },
    { id: 4, title: 'Tiếng rừng đêm', desc: 'Tiếng dế và gió thổi xào xạc', icon: '🦉', color: '#4ade80' }
];

const Emotion = () => {
    const [activeTrack, setActiveTrack] = useState(null);
    const [breathingText, setBreathingText] = useState('Bắt đầu');
    const [isBreathing, setIsBreathing] = useState(false);

    useEffect(() => {
        let interval;
        if (isBreathing) {
            let step = 0;
            const flow = ['Hít vào...', 'Nín thở...', 'Thở ra...', 'Nghỉ ngơi...'];
            setBreathingText(flow[0]);

            interval = setInterval(() => {
                step = (step + 1) % 4;
                setBreathingText(flow[step]);
            }, 4000);
        } else {
            setBreathingText('Bắt đầu hít thở');
        }
        return () => clearInterval(interval);
    }, [isBreathing]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1rem 0' }} className="emotion-page-container mobile-padding-0">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 8vw, 4rem)', padding: '0 1rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.25rem, 8vw, 3.5rem)', fontWeight: '900', marginBottom: '1rem' }}>Góc Bình Yên</h2>
                <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto' }}>
                    Hãy tạm gác lại những lo âu, dành vài phút ngắn ngủi để tìm lại sự cân bằng trong tâm hồn bạn.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }} className="emotion-grid">
                {/* Breathing Exercise */}
                <div className="glass-card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>Hít Thở Chánh Niệm</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>Kỹ thuật Box Breathing 4-4-4-4</p>

                    <div className="breathing-container" style={{ position: 'relative', width: 'clamp(180px, 40vw, 220px)', height: 'clamp(180px, 40vw, 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setIsBreathing(!isBreathing)}>
                        <div className={`breathing-circle ${isBreathing ? 'active' : ''}`}></div>
                        <div className="breathing-glow"></div>
                        <span style={{ position: 'relative', zIndex: 10, fontWeight: '900', color: isBreathing ? 'white' : 'var(--primary)', fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', padding: '0 1rem' }}>
                            {breathingText}
                        </span>
                    </div>

                    <p style={{ marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: '800', maxWidth: '300px' }}>
                        {isBreathing ? 'Tập trung vào hơi thở của bạn.' : 'Nhấn vào vòng tròn để bắt đầu.'}
                    </p>
                </div>

                {/* Music Section */}
                <div className="glass-card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: '800', marginBottom: '2rem', color: '#1e293b' }}>Âm Thanh Thư Giãn</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: activeTrack === track.id ? 'rgba(139, 92, 246, 0.08)' : '#f8fafc',
                                    borderRadius: '1.25rem',
                                    border: `2px solid ${activeTrack === track.id ? 'var(--primary-light)' : 'transparent'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                className="music-item"
                            >
                                <div style={{
                                    width: '3rem', height: '3rem',
                                    background: activeTrack === track.id ? 'var(--primary)' : 'white',
                                    borderRadius: '1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', flexShrink: 0,
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                    color: activeTrack === track.id ? 'white' : 'inherit'
                                }}>
                                    {activeTrack === track.id ? (
                                        <div className="playing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    ) : track.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>{track.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{track.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mindful Tips */}
                <div className="glass-card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: '800', marginBottom: '2rem', color: '#1e293b' }}>Thực Hành Mỗi Ngày</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { icon: '🧘', title: 'Tỉnh thức', text: '5 phút quan sát hơi thở nhẹ nhàng.' },
                            { icon: '🦶', title: 'Tiếp đất', text: 'Cảm nhận đôi chân khi bước đi.' },
                            { icon: '✍️', title: 'Biết ơn', text: 'Ghi lại 3 niềm vui trong ngày.' },
                            { icon: '📱', title: 'Cai thiết bị', text: 'Rời xa điện thoại trước khi ngủ.' }
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{tip.icon}</div>
                                <div>
                                    <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>{tip.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: '1.5' }}>{tip.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .breathing-circle {
                    width: 70%;
                    height: 70%;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid var(--primary-light);
                    transition: all 4s linear;
                    z-index: 5;
                    position: relative;
                }
                .breathing-circle.active {
                    animation: circleAnimation 16s linear infinite;
                    background: var(--primary);
                    border-color: white;
                }
                .breathing-glow {
                    position: absolute;
                    width: 70%;
                    height: 70%;
                    border-radius: 50%;
                    background: var(--primary);
                    opacity: 0;
                    transition: all 4s linear;
                    filter: blur(20px);
                }
                .breathing-circle.active + .breathing-glow {
                    animation: glowAnimation 16s linear infinite;
                    opacity: 0.4;
                }
                
                @keyframes circleAnimation {
                    0%, 100%, 75% { transform: scale(1); }
                    25%, 50% { transform: scale(1.4); }
                }
                @keyframes glowAnimation {
                    0%, 100%, 75% { transform: scale(1.1); opacity: 0; }
                    25%, 50% { transform: scale(1.8); opacity: 0.5; }
                }
                
                .playing-indicator {
                    display: flex;
                    align-items: flex-end;
                    gap: 3px;
                    height: 14px;
                }
                .playing-indicator span {
                    width: 2.5px;
                    background: white;
                    animation: barAnim 1s infinite ease-in-out;
                }
                .playing-indicator span:nth-child(2) { animation-delay: 0.2s; height: 60%; }
                .playing-indicator span:nth-child(3) { animation-delay: 0.4s; height: 80%; }
                @keyframes barAnim { 0%, 100% { height: 40%; } 50% { height: 100%; } }

                @media (max-width: 1024px) {
                    .emotion-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 768px) {
                    .emotion-page-container { border-radius: 0; }
                }
            `}</style>
        </div>
    );
};

export default Emotion;
