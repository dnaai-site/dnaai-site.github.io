import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getGeminiResponse } from '../services/gemini';

const careerCategories = [
    { emoji: '🎨', label: 'Sáng tạo & Nghệ thuật', value: 'creative' },
    { emoji: '💻', label: 'Công nghệ & Kỹ thuật', value: 'tech' },
    { emoji: '🏥', label: 'Y tế & Sức khỏe', value: 'health' },
    { emoji: '📚', label: 'Giáo dục & Nghiên cứu', value: 'education' },
    { emoji: '💼', label: 'Kinh doanh & Quản lý', value: 'business' },
    { emoji: '⚖️', label: 'Pháp lý & Hành chính', value: 'law' },
    { emoji: '🌍', label: 'Môi trường & Bền vững', value: 'environment' },
    { emoji: '🎭', label: 'Truyền thông & Giải trí', value: 'media' },
];

const Career = () => {
    const [step, setStep] = useState(0); // 0: intro, 1: quiz, 2: result
    const [answers, setAnswers] = useState({ categories: [], strength: '', value: '', workStyle: '' });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleCategory = (val) => {
        setAnswers(prev => ({
            ...prev,
            categories: prev.categories.includes(val)
                ? prev.categories.filter(c => c !== val)
                : prev.categories.length < 3
                    ? [...prev.categories, val]
                    : prev.categories
        }));
    };

    const handleGenerate = async () => {
        setLoading(true);
        setStep(2);
        const selectedLabels = answers.categories.map(v => careerCategories.find(c => c.value === v)?.label).join(', ');
        const prompt = `Bạn là chuyên gia tư vấn nghề nghiệp cho học sinh. Hãy phân tích và tư vấn nghề nghiệp dựa trên thông tin sau:
- Lĩnh vực yêu thích: ${selectedLabels}
- Điểm mạnh: ${answers.strength}
- Giá trị nghề nghiệp quan trọng nhất: ${answers.value}
- Phong cách làm việc: ${answers.workStyle}

Hãy đề xuất 3 ngành nghề phù hợp nhất, mỗi ngành gồm: tên nghề, lý do phù hợp, kỹ năng cần phát triển, và cơ hội việc làm tại Việt Nam. Trình bày rõ ràng, thân thiện, sử dụng emoji.`;

        const response = await getGeminiResponse(prompt, []);
        setResult(response);
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '1rem 0' }} className="career-container mobile-padding-0">
            {/* Step 0: Intro */}
            {step === 0 && (
                <div className="glass-card" style={{ textAlign: 'center', padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 3rem)' }}>
                    <div style={{ fontSize: 'clamp(3rem, 12vw, 4rem)', marginBottom: '1.25rem' }}>🚀</div>
                    <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)', fontWeight: '900', marginBottom: '0.75rem' }}>
                        Khám Phá Sự Nghiệp
                    </h2>
                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)', color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
                        Trả lời vài câu hỏi và AI sẽ phân tích, gợi ý ngành nghề phù hợp nhất với bạn.
                    </p>
                    <button className="btn btn-primary" onClick={() => setStep(1)} style={{ padding: '0.875rem 2.5rem', fontSize: '1.0625rem' }}>
                        Bắt đầu ngay
                    </button>
                </div>
            )}

            {/* Step 1: Quiz */}
            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: '800', marginBottom: '0.5rem' }}>Câu hỏi định hướng</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9375rem' }}>Trả lời thành thật để nhận tư vấn chính xác nhất</p>
                    </div>

                    {/* Q1: Interest Categories */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>
                            1. Bạn hứng thú với lĩnh vực nào? <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500' }}>(Tối đa 3)</span>
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                            {careerCategories.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => toggleCategory(cat.value)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.875rem',
                                        border: answers.categories.includes(cat.value) ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.categories.includes(cat.value) ? 'rgba(139, 92, 246, 0.08)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '700',
                                        fontSize: '0.8125rem',
                                        color: answers.categories.includes(cat.value) ? 'var(--primary)' : '#374151',
                                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>{cat.emoji}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Q2: Strength */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            2. Điểm mạnh nổi bật của bạn?
                        </h3>
                        <textarea
                            value={answers.strength}
                            onChange={e => setAnswers(prev => ({ ...prev, strength: e.target.value }))}
                            placeholder="Ví dụ: Giỏi giao tiếp, có tư duy phân tích tốt..."
                            rows={3}
                            style={{
                                width: '100%', padding: '0.875rem', border: '2px solid #e2e8f0',
                                borderRadius: '0.875rem', fontSize: '0.9375rem', resize: 'none',
                                outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
                                color: '#1e293b', background: '#f8fafc'
                            }}
                        />
                    </div>

                    {/* Q3: Value */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            3. Điều quan trọng nhất trong công việc?
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', width: '100%' }}>
                            {['💰 Thu nhập cao', '❤️ Giúp ích mọi người', '🎯 Thách thức & học hỏi', '⚖️ Cân bằng cuộc sống', '🌟 Danh tiếng', '🎨 Tự do sáng tạo'].map(v => (
                                <button key={v} onClick={() => setAnswers(prev => ({ ...prev, value: v }))}
                                    style={{
                                        padding: '0.75rem 1rem', borderRadius: '0.875rem', border: answers.value === v ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.value === v ? 'rgba(139, 92, 246, 0.08)' : 'white', cursor: 'pointer',
                                        fontWeight: '700', fontSize: '0.8125rem', color: answers.value === v ? 'var(--primary)' : '#374151',
                                        transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left'
                                    }}>{v}</button>
                            ))}
                        </div>
                    </div>

                    {/* Q4: Work Style */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            4. Phong cách làm việc lý tưởng?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['🏢 Văn phòng ổn định', '🌐 Linh hoạt, từ xa', '🤝 Làm việc nhóm', '🔬 Tập trung chuyên sâu', '🌍 Di chuyển nhiều'].map(style => (
                                <button key={style} onClick={() => setAnswers(prev => ({ ...prev, workStyle: style }))}
                                    style={{
                                        padding: '0.875rem 1.125rem', borderRadius: '0.875rem', border: answers.workStyle === style ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.workStyle === style ? 'rgba(139, 92, 246, 0.08)' : 'white', cursor: 'pointer',
                                        fontWeight: '700', fontSize: '0.875rem', color: answers.workStyle === style ? 'var(--primary)' : '#374151',
                                        textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}>{style}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={answers.categories.length === 0 || !answers.strength || !answers.value || !answers.workStyle}
                        style={{ padding: '1rem', fontSize: '1rem', alignSelf: 'center', width: '100%', marginTop: '1rem' }}
                    >
                        ✨ Nhận tư vấn từ AI
                    </button>
                </div>
            )}

            {/* Step 2: AI Result */}
            {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="hero-gradient-text" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Kết quả tư vấn</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Được phân tích bởi AI HeartSpace</p>
                    </div>

                    <div className="glass-card">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '1.5rem' }}>
                                    {[0, 0.2, 0.4].map((d, i) => (
                                        <div key={i} style={{
                                            width: '12px', height: '12px', background: 'var(--primary)',
                                            borderRadius: '50%', animation: `typing 1.2s ${d}s infinite ease-in-out`
                                        }} />
                                    ))}
                                </div>
                                <p style={{ color: 'var(--text-light)', fontWeight: '600' }}>AI đang phân tích hồ sơ...</p>
                                <style>{`@keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-8px); opacity: 1; } }`}</style>
                            </div>
                        ) : (
                            <div style={{ lineHeight: '1.8', fontSize: '0.9375rem', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                                {result}
                            </div>
                        )}
                    </div>

                    {!loading && (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => { setStep(1); setResult(''); }} className="btn" style={{ padding: '0.875rem 2rem', background: 'white', color: '#64748b', border: '2px solid #e2e8f0', minWidth: '150px' }}>
                                ← Làm lại
                            </button>
                            <Link to="/mbti" className="btn btn-primary" style={{ padding: '0.875rem 2rem', textDecoration: 'none', border: 'none', minWidth: '150px', textAlign: 'center' }}>
                                Trắc nghiệm MBTI →
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .glass-card { padding: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Career;
