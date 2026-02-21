import React, { useState } from 'react';

const questions = [
    "Bạn có thường xuyên cảm thấy mệt mỏi ngay cả khi mới ngủ dậy không?",
    "Bạn có cảm thấy khó tập trung vào việc học hành hay các hoạt động thường ngày?",
    "Bạn có hay lo lắng về tương lai hoặc những kỳ vọng của người khác?",
    "Bạn có thường xuyên cảm thấy cô đơn dù đang ở cùng gia đình hoặc bạn bè?",
    "Bạn có thay đổi thói quen ăn uống hoặc giấc ngủ trong thời gian gần đây?",
    "Bạn có cảm thấy khó kiềm chế cảm xúc (dễ cáu gắt hoặc mau nước mắt)?",
    "Bạn có cảm thấy mất đi sự hứng thú với những sở thích trước đây không?"
];

const StressTest = () => {
    const [stage, setStage] = useState('welcome'); // welcome, quiz, result
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    const handleAnswer = (val) => {
        setScore(prev => prev + val);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setStage('result');
        }
    };

    const getResultContent = () => {
        const avg = score / questions.length;
        if (avg >= 2.2) return {
            title: "Trái tim đang mệt nhoài 🆘",
            desc: "Trái tim bạn dường như đang chịu khá nhiều áp lực. Hãy nhớ rằng không cần phải gồng mình quá mức. Đây là lúc bạn cần nghỉ ngơi thực sự.",
            advice: ["Hãy trò chuyện với người thân hoặc tư vấn viên", "Tắt thông báo điện thoại và ngủ một giấc thật sâu", "Ăn món bạn thích nhất hôm nay", "Đừng ngại yêu cầu sự giúp đỡ"],
            color: '#ef4444',
            bg: '#fef2f2'
        };
        if (avg >= 1.2) return {
            title: "Có chút áp lực ⚠️",
            desc: "Bạn đang ở mức căng thẳng vừa phải. Đây là những cảm xúc bình thường trong quá trình học tập và trưởng thành, nhưng đừng chủ quan nhé.",
            advice: ["Dành 15 phút hít thở sâu mỗi tối", "Viết nhật ký để giải tỏa suy nghĩ", "Đi bộ nhẹ nhàng trong công viên", "Nghe một bản nhạc không lời"],
            color: '#f59e0b',
            bg: '#fffbeb'
        };
        return {
            title: "Tinh thần ổn định ✨",
            desc: "Bạn đang duy trì một trạng thái tinh thần rất tuyệt vời! Bạn có khả năng quản lý cảm xúc tốt và biết cách chăm sóc bản thân.",
            advice: ["Tiếp tục duy trì thói quen tích cực này", "Lan tỏa năng lượng tích cực đến bạn bè", "Thử thách bản thân với một kỹ năng mới", "Dành thời gian chăm sóc cây xanh"],
            color: '#10b981',
            bg: '#f0fdf4'
        };
    };

    const result = stage === 'result' ? getResultContent() : null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <div className="glass-card overflow-hidden" style={{ minHeight: '550px', display: 'flex', flexDirection: 'column' }}>
                {stage === 'welcome' && (
                    <div className="fade-in" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>📊</div>
                        <h2 className="hero-gradient-text" style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem' }}>Đánh Giá Stress</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.25rem', marginBottom: '3.5rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
                            Bài trắc nghiệm dựa trên thang đo tâm lý giúp bạn nhận diện sớm các dấu hiệu căng thẳng và mệt mỏi tinh thần.
                        </p>
                        <button className="btn btn-primary" onClick={() => setStage('quiz')} style={{ padding: '1.25rem 4rem', fontSize: '1.25rem' }}>Bắt đầu đánh giá</button>
                    </div>
                )}

                {stage === 'quiz' && (
                    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '8px', background: '#f1f5f9' }}>
                            <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>
                        <div style={{ padding: '4rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Câu hỏi {currentIndex + 1} / {questions.length}</span>
                                <h3 style={{ fontSize: '2.125rem', fontWeight: '800', marginTop: '2rem', color: '#1e293b', lineHeight: '1.4' }}>{questions[currentIndex]}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', maxWidth: '650px', margin: '0 auto', width: '100%' }}>
                                {[
                                    { label: 'Thường xuyên', val: 3, icon: '😫' },
                                    { label: 'Đôi khi', val: 2, icon: '😐' },
                                    { label: 'Hiếm khi', val: 1, icon: '😊' },
                                    { label: 'Không bao giờ', val: 0, icon: '🌟' }
                                ].map((opt, i) => (
                                    <button
                                        key={i}
                                        className="stress-opt-btn"
                                        style={{
                                            background: 'white',
                                            color: '#1e293b',
                                            borderRadius: '1.25rem',
                                            border: '2px solid #f1f5f9',
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                                            fontWeight: '700',
                                            fontSize: '1.0625rem'
                                        }}
                                        onClick={() => handleAnswer(opt.val)}
                                    >
                                        <span>{opt.label}</span>
                                        <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'result' && result && (
                    <div className="fade-in" style={{ padding: '4rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🌈</div>
                            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: result.color, marginBottom: '1rem' }}>{result.title}</h2>
                            <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>{result.desc}</p>
                        </div>

                        <div style={{ background: result.bg, padding: '2.5rem', borderRadius: '2rem', marginBottom: '3.5rem', border: `1px solid ${result.color}22` }}>
                            <h4 style={{ fontWeight: '900', color: result.color, marginBottom: '1.5rem', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Lời khuyên cho bạn:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                                {result.advice.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', fontWeight: '600', background: 'rgba(255, 255, 255, 0.5)', padding: '1rem', borderRadius: '1rem' }}>
                                        <span style={{ color: result.color, fontSize: '1.25rem' }}>•</span> {a}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => { setStage('welcome'); setScore(0); setCurrentIndex(0); }} style={{ padding: '1rem 3.5rem' }}>Làm lại bài test</button>
                            <button onClick={() => window.location.href = '/chatbot'} className="btn" style={{ background: 'white', border: '2px solid #e2e8f0', color: '#64748b', padding: '1rem 3.5rem' }}>Tâm sự với AI →</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .stress-opt-btn:hover {
                    border-color: var(--primary);
                    background: #f5f3ff;
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.08);
                }
                .stress-opt-btn:active { transform: scale(0.98); }
            `}</style>
        </div>
    );
};

export default StressTest;
