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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="hero-gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>Góc Bình Yên</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto' }}>
                    Hãy tạm gác lại những lo âu, dành vài phút ngắn ngủi để tìm lại sự cân bằng trong tâm hồn bạn.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {/* Breathing Exercise */}
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>Hít Thở Chánh Niệm</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1rem' }}>Sử dụng kỹ thuật Box Breathing để ổn định nhịp tim</p>

                    <div className="breathing-container" style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setIsBreathing(!isBreathing)}>
                        <div className={`breathing-circle ${isBreathing ? 'active' : ''}`}></div>
                        <div className="breathing-glow"></div>
                        <span style={{ position: 'relative', zIndex: 10, fontWeight: '900', color: isBreathing ? 'white' : 'var(--primary)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: isBreathing ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
                            {breathingText}
                        </span>
                    </div>

                    <p style={{ marginTop: '3rem', color: '#94a3b8', fontSize: '0.9375rem', fontWeight: '600', maxWidth: '300px' }}>
                        {isBreathing ? 'Hãy tập trung vào luồng khí đi vào và đi ra khỏi cơ thể.' : 'Nhấn vào vòng tròn để bắt đầu bài tập hít thở 4-4-4-4.'}
                    </p>
                </div>

                {/* Music Section */}
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', color: '#1e293b' }}>Âm Thanh Thư Giãn</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1.25rem',
                                    background: activeTrack === track.id ? 'rgba(139, 92, 246, 0.08)' : '#f8fafc',
                                    borderRadius: '1.5rem',
                                    border: `2px solid ${activeTrack === track.id ? 'var(--primary-light)' : 'transparent'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                                className="music-item"
                            >
                                <div style={{
                                    width: '3.5rem', height: '3.5rem',
                                    background: activeTrack === track.id ? 'var(--primary)' : 'white',
                                    borderRadius: '1.25rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.75rem',
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
                                    <div style={{ fontWeight: '800', fontSize: '1.125rem', color: '#1e293b' }}>{track.title}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{track.desc}</div>
                                </div>
                                {activeTrack === track.id && <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase' }}>Đang phát</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mindful Tips */}
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', color: '#1e293b' }}>Thực Hành Mỗi Ngày</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {[
                            { icon: '🧘', title: 'Tỉnh thức', text: 'Dành 5 phút quan sát hơi thở mà không phán xét.' },
                            { icon: '🦶', title: 'Tiếp đất', text: 'Cảm nhận đôi chân chạm đất để lấy lại sự hiện diện.' },
                            { icon: '✍️', title: 'Biết ơn', text: 'Viết ra 3 điều nhỏ bé khiến bạn mỉm cười hôm nay.' },
                            { icon: '📱', title: 'Ngắt kết nối', text: 'Rời xa màn hình điện thoại 30 phút trước khi ngủ.' }
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{tip.icon}</div>
                                <div>
                                    <h4 style={{ fontWeight: '800', fontSize: '1.125rem', color: '#1e293b', marginBottom: '0.5rem' }}>{tip.title}</h4>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: '1.5' }}>{tip.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .breathing-circle {
                    width: 140px;
                    height: 140px;
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
                    width: 140px;
                    height: 140px;
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
                    25%, 50% { transform: scale(1.6); }
                }
                @keyframes glowAnimation {
                    0%, 100%, 75% { transform: scale(1.1); opacity: 0; }
                    25%, 50% { transform: scale(2.2); opacity: 0.5; }
                }
                
                .music-item:hover {
                    transform: translateX(10px);
                    background: white !important;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.03);
                }
                
                .playing-indicator {
                    display: flex;
                    align-items: flex-end;
                    gap: 3px;
                    height: 18px;
                }
                .playing-indicator span {
                    width: 3px;
                    background: white;
                    animation: barAnim 1s infinite ease-in-out;
                }
                .playing-indicator span:nth-child(2) { animation-delay: 0.2s; height: 60%; }
                .playing-indicator span:nth-child(3) { animation-delay: 0.4s; height: 80%; }
                @keyframes barAnim { 0%, 100% { height: 40%; } 50% { height: 100%; } }
            `}</style>
        </div>
    );
};

export default Emotion;
