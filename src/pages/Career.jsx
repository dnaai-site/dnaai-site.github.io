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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            {/* Step 0: Intro */}
            {step === 0 && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
                    <h2 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
                        Khám Phá Con Đường Sự Nghiệp
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
                        Trả lời vài câu hỏi ngắn và AI sẽ phân tích, gợi ý ngành nghề phù hợp nhất với bạn.
                    </p>
                    <button className="btn btn-primary" onClick={() => setStep(1)} style={{ padding: '1rem 2.5rem', fontSize: '1.0625rem' }}>
                        Bắt đầu khám phá →
                    </button>
                </div>
            )}

            {/* Step 1: Quiz */}
            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="hero-gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Câu hỏi định hướng</h2>
                        <p style={{ color: 'var(--text-light)' }}>Trả lời thành thật để nhận tư vấn chính xác nhất</p>
                    </div>

                    {/* Q1: Interest Categories */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>
                            1. Bạn hứng thú với lĩnh vực nào? <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500' }}>(chọn tối đa 3)</span>
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
                            {careerCategories.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => toggleCategory(cat.value)}
                                    style={{
                                        padding: '0.875rem',
                                        borderRadius: '1rem',
                                        border: answers.categories.includes(cat.value) ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.categories.includes(cat.value) ? 'rgba(139, 92, 246, 0.08)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.625rem',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        color: answers.categories.includes(cat.value) ? 'var(--primary)' : '#374151',
                                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}
                                >
                                    <span style={{ fontSize: '1.375rem' }}>{cat.emoji}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Q2: Strength */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            2. Điểm mạnh nổi bật của bạn là gì?
                        </h3>
                        <textarea
                            value={answers.strength}
                            onChange={e => setAnswers(prev => ({ ...prev, strength: e.target.value }))}
                            placeholder="Ví dụ: Tôi giỏi giao tiếp, thích giải quyết vấn đề, có tư duy phân tích tốt..."
                            rows={3}
                            style={{
                                width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                                borderRadius: '0.875rem', fontSize: '0.9375rem', resize: 'none',
                                outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
                                transition: 'border-color 0.2s', color: '#1e293b', background: '#f8fafc'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Q3: Value */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            3. Điều quan trọng nhất với bạn trong công việc?
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            {['💰 Thu nhập cao', '❤️ Giúp ích cho mọi người', '🎯 Thách thức & học hỏi', '⚖️ Cân bằng cuộc sống', '🌟 Danh tiếng & ảnh hưởng', '🎨 Tự do sáng tạo'].map(v => (
                                <button key={v} onClick={() => setAnswers(prev => ({ ...prev, value: v }))}
                                    style={{
                                        padding: '0.75rem 1rem', borderRadius: '0.875rem', border: answers.value === v ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.value === v ? 'rgba(139, 92, 246, 0.08)' : 'white', cursor: 'pointer',
                                        fontWeight: '700', fontSize: '0.875rem', color: answers.value === v ? 'var(--primary)' : '#374151',
                                        transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'left'
                                    }}>{v}</button>
                            ))}
                        </div>
                    </div>

                    {/* Q4: Work Style */}
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>
                            4. Phong cách làm việc lý tưởng của bạn?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['🏢 Văn phòng cố định, môi trường ổn định', '🌐 Làm việc từ xa, linh hoạt giờ giấc', '🤝 Làm việc nhóm, tương tác nhiều người', '🔬 Nghiên cứu độc lập, tập trung sâu', '🌍 Di chuyển nhiều, trải nghiệm đa dạng'].map(style => (
                                <button key={style} onClick={() => setAnswers(prev => ({ ...prev, workStyle: style }))}
                                    style={{
                                        padding: '0.875rem 1.125rem', borderRadius: '0.875rem', border: answers.workStyle === style ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: answers.workStyle === style ? 'rgba(139, 92, 246, 0.08)' : 'white', cursor: 'pointer',
                                        fontWeight: '600', fontSize: '0.9375rem', color: answers.workStyle === style ? 'var(--primary)' : '#374151',
                                        textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif'
                                    }}>{style}</button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={answers.categories.length === 0 || !answers.strength || !answers.value || !answers.workStyle}
                        style={{ padding: '1rem 2.5rem', fontSize: '1rem', alignSelf: 'center', width: '100%' }}
                    >
                        ✨ Phân tích & Tư vấn nghề nghiệp
                    </button>
                </div>
            )}

            {/* Step 2: AI Result */}
            {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="hero-gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Kết quả tư vấn của bạn</h2>
                        <p style={{ color: 'var(--text-light)' }}>Được phân tích bởi AI HeartSpace</p>
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
                                <p style={{ color: 'var(--text-light)', fontWeight: '600' }}>AI đang phân tích hồ sơ của bạn...</p>
                                <style>{`.typing { } @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-8px); opacity: 1; } }`}</style>
                            </div>
                        ) : (
                            <div style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', whiteSpace: 'pre-wrap' }}>
                                {result}
                            </div>
                        )}
                    </div>

                    {!loading && (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => { setStep(1); setResult(''); }} className="btn" style={{ padding: '0.875rem 2rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                ← Làm lại
                            </button>
                            <Link to="/mbti" className="btn btn-primary" style={{ padding: '0.875rem 2rem', textDecoration: 'none' }}>
                                Làm bài MBTI để biết thêm →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Career;
