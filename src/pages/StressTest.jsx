import React, { useState } from 'react';

const questions = [
    "Bạn có thường xuyên cảm thấy mệt mỏi ngay cả khi mới ngủ dậy không?",
    "Bạn có cảm thấy khó tập trung vào việc học hành hay các hoạt động thường ngày?",
    "Bạn có hay lo lắng về tương lai hoặc những kỳ vọng của người khác?",
    "Bạn có thường xuyên cảm thấy cô đơn dù đang ở cùng gia đình hoặc bạn bè?",
    "Bạn có thay đổi thói quen ăn uống hoặc giấc ngủ trong thời gian gần đây?"
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

    const getResult = () => {
        if (score > 10) return "Trái tim bạn dường như đang chịu khá nhiều áp lực. Hãy nhớ rằng không cần phải gồng mình quá mức. Một cuộc dạo bộ hoặc buổi trò chuyện với người bạn tin tưởng sẽ giúp ích rất nhiều cho bạn lúc này.";
        if (score > 5) return "Bạn đang ở mức căng thẳng vừa phải. Đây là những cảm xúc bình thường trong quá trình học tập và trưởng thành. Đừng quên dành thời gian thư giãn mỗi ngày bạn nhé!";
        return "Bạn đang duy trì một trạng thái tinh thần rất tuyệt vời! Hãy tiếp tục chăm sóc bản thân và lan tỏa năng lượng tích cực này đến bạn bè xung quanh nhé.";
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 0' }}>
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {stage === 'welcome' && (
                    <div className="fade-in">
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Đánh Giá Stress</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem' }}>Theo dõi sức khỏe tinh thần của bạn qua bài trắc nghiệm nhanh 5 câu hỏi.</p>
                        <button className="btn btn-primary" onClick={() => setStage('quiz')}>Bắt đầu đánh giá</button>
                    </div>
                )}

                {stage === 'quiz' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '2.5rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>Câu hỏi {currentIndex + 1} / 5</span>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentIndex + 1) / 5) * 100}%`, transition: 'width 0.3s' }}></div>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '3rem', color: '#1e293b' }}>{questions[currentIndex]}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[
                                { label: 'Thường xuyên', val: 3, bg: '#fef2f2', color: '#dc2626' },
                                { label: 'Đôi khi', val: 2, bg: '#fffbeb', color: '#d97706' },
                                { label: 'Hiếm khi', val: 1, bg: '#f0fdf4', color: '#16a34a' },
                                { label: 'Không bao giờ', val: 0, bg: '#f8fafc', color: '#475569' }
                            ].map((opt, i) => (
                                <button
                                    key={i}
                                    className="btn"
                                    style={{ background: opt.bg, color: opt.color, borderRadius: '1rem', border: `1px solid ${opt.bg}`, padding: '1rem' }}
                                    onClick={() => handleAnswer(opt.val)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {stage === 'result' && (
                    <div className="fade-in">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌈</div>
                        <h2 className="hero-gradient-text" style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Kết quả đánh giá</h2>
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.5rem', marginBottom: '2.5rem', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'left' }}>
                            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#1e293b' }}>{getResult()}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => { setStage('welcome'); setScore(0); setCurrentIndex(0); }}>Làm lại bài test</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StressTest;
