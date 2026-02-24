import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveTestResult } from '../services/firebase';

const questions = [
    // E vs I (Extraversion vs Introversion)
    { id: 1, text: "Bạn cảm thấy hứng khởi khi ở trong đám đông hơn là ở một mình.", dim: 'E', rev: false },
    { id: 2, text: "Bạn thường là người bắt đầu cuộc trò chuyện với người lạ.", dim: 'E', rev: false },
    { id: 3, text: "Bạn thích làm việc một mình yên tĩnh hơn là làm việc nhóm ồn ào.", dim: 'E', rev: true },
    { id: 4, text: "Sau một tuần làm việc căng thẳng, bạn muốn ra ngoài chơi hơn là ở nhà nghỉ ngơi.", dim: 'E', rev: false },
    { id: 5, text: "Bạn suy nghĩ kỹ trước khi nói thay vì nói ra ngay suy nghĩ của mình.", dim: 'E', rev: true },
    { id: 6, text: "Việc trở thành tâm điểm của sự chú ý khiến bạn không thoải mái.", dim: 'E', rev: true },
    // N vs S (Intuition vs Sensing)
    { id: 7, text: "Bạn quan tâm đến ý nghĩa ẩn sau sự việc hơn là những chi tiết thực tế.", dim: 'N', rev: false },
    { id: 8, text: "Bạn thường mơ mộng về tương lai hơn là tập trung vào hiện tại.", dim: 'N', rev: false },
    { id: 9, text: "Bạn tin vào kinh nghiệm thực tế hơn là những lý thuyết trừu tượng.", dim: 'N', rev: true },
    { id: 10, text: "Bạn thích những hướng dẫn cụ thể, rõ ràng từng bước một.", dim: 'N', rev: true },
    { id: 11, text: "Bạn thường nhìn thấy bức tranh toàn cảnh trước khi đi vào chi tiết.", dim: 'N', rev: false },
    { id: 12, text: "Bạn thích sự mới lạ và sáng tạo hơn là những quy trình đã được kiểm chứng.", dim: 'N', rev: false },
    // T vs F (Thinking vs Feeling)
    { id: 13, text: "Khi giải quyết vấn đề, bạn dựa vào logic hơn là cảm xúc.", dim: 'T', rev: false },
    { id: 14, text: "Bạn coi trọng sự công bằng và nhất quán hơn là sự hòa hợp và khoan dung.", dim: 'T', rev: false },
    { id: 15, text: "Bạn thường bị đánh giá là người lạnh lùng hoặc quá lý trí.", dim: 'T', rev: false },
    { id: 16, text: "Bạn dễ bị ảnh hưởng bởi cảm xúc của người khác.", dim: 'T', rev: true },
    { id: 17, text: "Trong một cuộc tranh luận, sự thật quan trọng hơn là không làm tổn thương ai đó.", dim: 'T', rev: false },
    { id: 18, text: "Bạn đưa ra quyết định dựa trên trái tim mách bảo hơn là phân tích số liệu.", dim: 'T', rev: true },
    // J vs P (Judging vs Perceiving)
    { id: 19, text: "Bạn thích lên kế hoạch chi tiết cho mọi việc trước khi bắt đầu.", dim: 'J', rev: false },
    { id: 20, text: "Bạn cảm thấy khó chịu khi mọi thứ không diễn ra theo kế hoạch.", dim: 'J', rev: false },
    { id: 21, text: "Bạn thích để mọi thứ tự nhiên, tùy cơ ứng biến hơn là sắp đặt trước.", dim: 'J', rev: true },
    { id: 22, text: "Bạn thường hoàn thành công việc trước thời hạn rất lâu.", dim: 'J', rev: false },
    { id: 23, text: "Bạn thích giữ cho các lựa chọn của mình luôn mở thay vì chốt phương án sớm.", dim: 'J', rev: true },
    { id: 24, text: "Sự ngăn nắp và trật tự là rất quan trọng đối với bạn.", dim: 'J', rev: false },
];

const types = {
    "ISTJ": { title: "Người Trách Nhiệm", desc: "Nghiêm túc, thực tế và đáng tin cậy. Họ coi trọng truyền thống và sự trật tự.", strengths: ["Có trách nhiệm", "Tỉ mỉ", "Trung thực"], weaknesses: ["Cứng nhắc", "Khó thích nghi", "Hay phán xét"], compatibility: "ESFP, ESTP" },
    "ISFJ": { title: "Người Nuôi Dưỡng", desc: "Ấm áp, tận tụy và luôn quan tâm đến người khác. Họ làm việc chăm chỉ để đảm bảo sự hài hòa.", strengths: ["Hỗ trợ tốt", "Đáng tin cậy", "Kiên nhẫn"], weaknesses: ["Quá nhún nhường", "Ngại thay đổi", "Dễ bị lợi dụng"], compatibility: "ESTP, ESFP" },
    "INFJ": { title: "Người Che Chở", desc: "Sâu sắc, lý tưởng hóa và đầy lòng trắc ẩn. Họ luôn tìm kiếm ý nghĩa sâu xa trong cuộc sống.", strengths: ["Sáng tạo", "Thấu hiểu", "Quyết tâm"], weaknesses: ["Nhạy cảm", "Dễ kiệt sức", "Cầu toàn"], compatibility: "ENFP, ENTP" },
    "INTJ": { title: "Nhà Kiến Tạo", desc: "Tư duy chiến lược, độc lập và có tầm nhìn xa. Họ luôn tìm cách cải tiến mọi thứ.", strengths: ["Thông minh", "Tự tin", "Chiến lược"], weaknesses: ["Kiêu ngạo", "Quá phân tích", "Thiếu kiên nhẫn"], compatibility: "ENFP, ENTP" },
    "ISTP": { title: "Nhà Kỹ Thuật", desc: "Thực tế, linh hoạt và giỏi giải quyết vấn đề. Họ thích tìm hiểu cách mọi thứ vận hành.", strengths: ["Lạc quan", "Sáng tạo", "Thực tế"], weaknesses: ["Cứng đầu", "Rủi ro cao", "Kín đáo"], compatibility: "ESFJ, ESTJ" },
    "ISFP": { title: "Người Nghệ Sĩ", desc: "Nhẹ nhàng, thân thiện và yêu cái đẹp. Họ thích sống trong hiện tại và tận hưởng từng khoảnh khắc.", strengths: ["Duyên dáng", "Nghệ thuật", "Đam mê"], weaknesses: ["Dễ căng thẳng", "Cạnh tranh kém", "Khó đoán"], compatibility: "ENFJ, ESFJ" },
    "INFP": { title: "Người Hòa Giải", desc: "Lý tưởng, trung thành và luôn tìm kiếm sự tốt đẹp trong mọi người. Họ sống theo giá trị riêng.", strengths: ["Đồng cảm", "Sáng tạo", "Cởi mở"], weaknesses: ["Mơ mộng quá mức", "Dễ tổn thương", "Thiếu thực tế"], compatibility: "ENFJ, ENTJ" },
    "INTP": { title: "Nhà Tư Duy", desc: "Sáng tạo, logic và tò mò. Họ thích phân tích các hệ thống và ý tưởng trừu tượng.", strengths: ["Phân tích tốt", "Tư duy mở", "Khách quan"], weaknesses: ["Lơ đãng", "Thiếu tổ chức", "Vô tâm"], compatibility: "ENTJ, ENFJ" },
    "ESTP": { title: "Người Thực Thi", desc: "Năng động, thực tế và thích hành động ngay lập tức. Họ giải quyết vấn đề một cách linh hoạt.", strengths: ["Táo bạo", "Hòa đồng", "Thẳng thắn"], weaknesses: ["Thiếu kiên nhẫn", "Rủi ro cao", "Mau chán"], compatibility: "ISFJ, ISTJ" },
    "ESFP": { title: "Người Trình Diễn", desc: "Vui vẻ, nhiệt tình và thích là trung tâm của sự chú ý. Họ làm cho cuộc sống trở nên thú vị.", strengths: ["Táo bạo", "Thực tế", "Thẩm mỹ tốt"], weaknesses: ["Khó tập trung", "Dễ tự ái", "Kém quy hoạch"], compatibility: "ISTJ, ISFJ" },
    "ENFP": { title: "Người Truyền Cảm Hứng", desc: "Nhiệt tình, sáng tạo và hòa đồng. Họ luôn tìm thấy khả năng trong mọi việc.", strengths: ["Tò mò", "Giao tiếp tốt", "Năng lượng cao"], weaknesses: ["Thiếu tập trung", "Suy nghĩ quá nhiều", "Dễ căng thẳng"], compatibility: "INFJ, INTJ" },
    "ENTP": { title: "Người Tranh Biện", desc: "Thông minh, nhanh trí và thích thử thách các ý tưởng. Họ giỏi tìm ra giải pháp mới.", strengths: ["Hiểu biết rộng", "Tư duy nhanh", "Sáng tạo"], weaknesses: ["Thích tranh cãi", "Tàn nhẫn", "Mau chán"], compatibility: "INTJ, INFJ" },
    "ESTJ": { title: "Người Điều Hành", desc: "Thực tế, quyết đoán và giỏi tổ chức. Họ thích quản lý mọi việc theo quy trình rõ ràng.", strengths: ["Tận tụy", "Mạnh mẽ", "Tổ chức tốt"], weaknesses: ["Cứng nhắc", "Khó thư giãn", "Phán xét"], compatibility: "ISFP, ISTP" },
    "ESFJ": { title: "Người Chăm Sóc", desc: "Tận tâm, hòa đồng và thích giúp đỡ người khác. Họ coi trọng sự hòa hợp và truyền thống.", strengths: ["Trung loyal", "Nhạy cảm", "Giỏi kết nối"], weaknesses: ["Cần được khen", "Thiếu linh hoạt", "Dễ bị chỉ trích"], compatibility: "ISFP, ISTP" },
    "ENFJ": { title: "Người Chỉ Dẫn", desc: "Lôi cuốn, đáng tin cậy và giỏi lãnh đạo. Họ luôn nhìn thấy tiềm năng ở người khác.", strengths: ["Khoan dung", "Đáng tin cậy", "Lôi cuốn"], weaknesses: ["Quá duy tâm", "Quá nhạy cảm", "Hay lo lắng"], compatibility: "INFP, ISFP" },
    "ENTJ": { title: "Nhà Lãnh Đạo", desc: "Thẳng thắn, quyết đoán và có khả năng nhìn xa trông rộng. Họ giỏi vạch ra kế hoạch dài hạn.", strengths: ["Hiệu quả", "Tự tin", "Lý trí"], weaknesses: ["Độc đoán", "Kiêu ngạo", "Lạnh lùng"], compatibility: "INFP, INTP" }
};

const MBTI = () => {
    const { user } = useAuth();
    const [stage, setStage] = useState('welcome'); // welcome, quiz, loading, result
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const startTest = () => setStage('quiz');

    const handleAnswer = (value) => {
        const q = questions[currentIndex];
        const newAnswers = { ...answers, [q.id]: value };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setStage('loading');
            setTimeout(() => calculateResult(newAnswers), 2000);
        }
    };

    const goBack = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const calculateResult = async (finalAnswers) => {
        let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

        questions.forEach(q => {
            let val = finalAnswers[q.id] || 3;
            const weight = Math.abs(val - 3);

            let primary = q.dim;
            let secondary = '';
            if (primary === 'E') secondary = 'I';
            else if (primary === 'N') secondary = 'S';
            else if (primary === 'T') secondary = 'F';
            else if (primary === 'J') secondary = 'P';

            if (q.rev) {
                if (val > 3) scores[secondary] += weight;
                else if (val < 3) scores[primary] += weight;
            } else {
                if (val > 3) scores[primary] += weight;
                else if (val < 3) scores[secondary] += weight;
            }
        });

        let type = "";
        type += scores.E >= scores.I ? "E" : "I";
        type += scores.N >= scores.S ? "N" : "S";
        type += scores.T >= scores.F ? "T" : "F";
        type += scores.J >= scores.P ? "J" : "P";

        const mbtiResult = { type, ...types[type], scores };
        setResult(mbtiResult);
        setStage('result');

        // Save result
        if (user) {
            await saveTestResult(user.uid, {
                type: 'MBTI',
                title: `${type} - ${types[type].title}`,
                result: type
            });
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem 0' }} className="mobile-padding-0">
            <div className="glass-card overflow-hidden mbti-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', position: 'relative', padding: 0 }}>

                {stage === 'welcome' && (
                    <div style={{ padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 3rem)', textAlign: 'center' }} className="fade-in">
                        <div style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', marginBottom: '1.5rem' }}>🧩</div>
                        <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>Khám Phá Tính Cách</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(1rem, 4vw, 1.25rem)', marginBottom: '2.5rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                            Trắc nghiệm MBTI giúp bạn hiểu rõ thế giới nội tâm, cách bạn tiếp nhận thông tin và đưa ra quyết định trong cuộc sống.
                        </p>
                        <button className="btn btn-primary" onClick={startTest} style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>Bắt đầu ngay</button>
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 4vw, 2rem)', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '800', flexWrap: 'wrap' }}>
                            <span>⏱️ 5-10 phút</span>
                            <span>📝 24 câu hỏi</span>
                            <span>✨ Chính xác cao</span>
                        </div>
                    </div>
                )}

                {stage === 'quiz' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '6px', background: '#f1f5f9', position: 'relative' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>

                        <div style={{ padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 3rem)', flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <button onClick={goBack} disabled={currentIndex === 0} style={{ background: 'none', border: 'none', color: currentIndex === 0 ? '#e2e8f0' : 'var(--primary)', fontWeight: '800', cursor: currentIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    ← Quay lại
                                </button>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.1em' }}>CÂU HỎI {currentIndex + 1} / 24</span>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <h3 style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)', fontWeight: '800', marginBottom: '3.5rem', color: '#1e293b', lineHeight: '1.4', maxWidth: '700px' }}>{questions[currentIndex].text}</h3>

                                <div className="likert-container" style={{ width: '100%', maxWidth: '600px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#94a3b8', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <span style={{ color: '#ef4444' }}>Không đồng ý</span>
                                        <span style={{ color: '#22c55e' }}>Rất đồng ý</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 0.5rem' }}>
                                        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0, transform: 'translateY(-50%)' }}></div>
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => handleAnswer(v)}
                                                className={`likert-btn v-${v}`}
                                                style={{
                                                    width: v === 3 ? 'clamp(30px, 8vw, 40px)' : v === 1 || v === 5 ? 'clamp(50px, 14vw, 70px)' : 'clamp(40px, 11vw, 55px)',
                                                    height: v === 3 ? 'clamp(30px, 8vw, 40px)' : v === 1 || v === 5 ? 'clamp(50px, 14vw, 70px)' : 'clamp(40px, 11vw, 55px)',
                                                    borderRadius: '50%',
                                                    border: '4px solid white',
                                                    background: 'white',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                    cursor: 'pointer',
                                                    zIndex: 1,
                                                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{
                                                    width: '50%', height: '50%', borderRadius: '50%',
                                                    background: v > 3 ? '#22c55e' : v < 3 ? '#ef4444' : '#cbd5e1',
                                                    opacity: answers[questions[currentIndex].id] === v ? 1 : 0.3,
                                                    transform: answers[questions[currentIndex].id] === v ? 'scale(1.2)' : 'scale(1)',
                                                    transition: 'all 0.2s'
                                                }}></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'loading' && (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center' }} className="fade-in">
                        <div className="loader-container" style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2.5rem auto' }}>
                            <div className="loader-ring" style={{ width: '80px', height: '80px' }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧠</div>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>Đang giải mã...</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>AI đang phân tích các phản hồi của bạn.</p>
                    </div>
                )}

                {stage === 'result' && result && (
                    <div style={{ padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 3rem)' }} className="fade-in result-page">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.2em' }}>NHÓM TÍNH CÁCH CỦA BẠN</span>
                            <h2 style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', fontWeight: '900', background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.1', margin: '0.5rem 0' }}>{result.type}</h2>
                            <h3 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: '800', color: '#1e293b' }}>{result.title}</h3>
                        </div>

                        <div style={{ background: 'white', border: '1px solid #f1f5f9', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)', lineHeight: '1.8', color: '#475569', textAlign: 'center' }}>"{result.desc}"</p>
                        </div>

                        <div className="res-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #dcfce7' }}>
                                <h4 style={{ fontWeight: '900', color: '#16a34a', marginBottom: '1rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💪 Thế mạnh</h4>
                                <ul style={{ listStyle: 'none', padding: 0, color: '#166534', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontWeight: '600', fontSize: '0.9375rem' }}>
                                    {result.strengths.map((s, i) => <li key={i}>✨ {s}</li>)}
                                </ul>
                            </div>
                            <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #fee2e2' }}>
                                <h4 style={{ fontWeight: '900', color: '#dc2626', marginBottom: '1rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ Cần cải thiện</h4>
                                <ul style={{ listStyle: 'none', padding: 0, color: '#991b1b', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontWeight: '600', fontSize: '0.9375rem' }}>
                                    {result.weaknesses.map((w, i) => <li key={i}>🎯 {w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '1.75rem', borderRadius: '1.5rem', textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h4 style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.125rem' }}>🤝 Mức độ tương thích</h4>
                            <p style={{ fontSize: '1rem', color: '#6d28d9', fontWeight: '700' }}>Tương thích với: <span style={{ background: 'white', padding: '0.25rem 0.875rem', borderRadius: '999px', marginLeft: '0.375rem', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.1)', display: 'inline-block' }}>{result.compatibility}</span></p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => { setStage('welcome'); setAnswers({}); setCurrentIndex(0); }} style={{ padding: '0.875rem 2rem' }}>Làm lại</button>
                            <Link to="/career" className="btn" style={{ background: 'white', border: '2px solid #e2e8f0', color: '#64748b', textDecoration: 'none', padding: '0.875rem 2rem' }}>Hướng nghiệp →</Link>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .loader-ring {
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid var(--primary);
                    border-radius: 50%;
                    width: 70px;
                    height: 70px;
                    animation: spin 1.5s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                
                .likert-btn:hover {
                    transform: scale(1.1) translateY(-3px);
                }
                .likert-btn:active { transform: scale(0.95); }

                @media (max-width: 768px) {
                    .mbti-card { border-radius: 0; border: none; }
                }
            `}</style>
        </div>
    );
};

export default MBTI;
