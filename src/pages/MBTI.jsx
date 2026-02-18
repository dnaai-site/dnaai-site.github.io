import React, { useState } from 'react';

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
    "ISTJ": { title: "Người Trách Nhiệm", desc: "Nghiêm túc, thực tế và đáng tin cậy. Họ coi trọng truyền thống và sự trật tự.", strengths: ["Có trách nhiệm", "Tỉ mỉ", "Trung thực"], weaknesses: ["Cứng nhắc", "Khó thích nghi", "Hay phán xét"] },
    "ISFJ": { title: "Người Nuôi Dưỡng", desc: "Ấm áp, tận tụy và luôn quan tâm đến người khác. Họ làm việc chăm chỉ để đảm bảo sự hài hòa.", strengths: ["Hỗ trợ tốt", "Đáng tin cậy", "Kiên nhẫn"], weaknesses: ["Quá nhún nhường", "Ngại thay đổi", "Dễ bị lợi dụng"] },
    "INFJ": { title: "Người Che Chở", desc: "Sâu sắc, lý tưởng hóa và đầy lòng trắc ẩn. Họ luôn tìm kiếm ý nghĩa sâu xa trong cuộc sống.", strengths: ["Sáng tạo", "Thấu hiểu", "Quyết tâm"], weaknesses: ["Nhạy cảm", "Dễ kiệt sức", "Cầu toàn"] },
    "INTJ": { title: "Nhà Kiến Tạo", desc: "Tư duy chiến lược, độc lập và có tầm nhìn xa. Họ luôn tìm cách cải tiến mọi thứ.", strengths: ["Thông minh", "Tự tin", "Chiến lược"], weaknesses: ["Kiêu ngạo", "Quá phân tích", "Thiếu kiên nhẫn"] },
    "ISTP": { title: "Nhà Kỹ Thuật", desc: "Thực tế, linh hoạt và giỏi giải quyết vấn đề. Họ thích tìm hiểu cách mọi thứ vận hành.", strengths: ["Lạc quan", "Sáng tạo", "Thực tế"], weaknesses: ["Cứng đầu", "Rủi ro cao", "Kín đáo"] },
    "ISFP": { title: "Người Nghệ Sĩ", desc: "Nhẹ nhàng, thân thiện và yêu cái đẹp. Họ thích sống trong hiện tại và tận hưởng từng khoảnh khắc.", strengths: ["Duyên dáng", "Nghệ thuật", "Đam mê"], weaknesses: ["Dễ căng thẳng", "Cạnh tranh kém", "Khó đoán"] },
    "INFP": { title: "Người Hòa Giải", desc: "Lý tưởng, trung thành và luôn tìm kiếm sự tốt đẹp trong mọi người. Họ sống theo giá trị riêng.", strengths: ["Đồng cảm", "Sáng tạo", "Cởi mở"], weaknesses: ["Mơ mộng quá mức", "Dễ tổn thương", "Thiếu thực tế"] },
    "INTP": { title: "Nhà Tư Duy", desc: "Sáng tạo, logic và tò mò. Họ thích phân tích các hệ thống và ý tưởng trừu tượng.", strengths: ["Phân tích tốt", "Tư duy mở", "Khách quan"], weaknesses: ["Lơ đãng", "Thiếu tổ chức", "Vô tâm"] },
    "ESTP": { title: "Người Thực Thi", desc: "Năng động, thực tế và thích hành động ngay lập tức. Họ giải quyết vấn đề một cách linh hoạt.", strengths: ["Táo bạo", "Hòa đồng", "Thẳng thắn"], weaknesses: ["Thiếu kiên nhẫn", "Rủi ro cao", "Mau chán"] },
    "ESFP": { title: "Người Trình Diễn", desc: "Vui vẻ, nhiệt tình và thích là trung tâm của sự chú ý. Họ làm cho cuộc sống trở nên thú vị.", strengths: ["Táo bạo", "Thực tế", "Thẩm mỹ tốt"], weaknesses: ["Khó tập trung", "Dễ tự ái", "Kém quy hoạch"] },
    "ENFP": { title: "Người Truyền Cảm Hứng", desc: "Nhiệt tình, sáng tạo và hòa đồng. Họ luôn tìm thấy khả năng trong mọi việc.", strengths: ["Tò mò", "Giao tiếp tốt", "Năng lượng cao"], weaknesses: ["Thiếu tập trung", "Suy nghĩ quá nhiều", "Dễ căng thẳng"] },
    "ENTP": { title: "Người Tranh Biện", desc: "Thông minh, nhanh trí và thích thử thách các ý tưởng. Họ giỏi tìm ra giải pháp mới.", strengths: ["Hiểu biết rộng", "Tư duy nhanh", "Sáng tạo"], weaknesses: ["Thích tranh cãi", "Tàn nhẫn", "Mau chán"] },
    "ESTJ": { title: "Người Điều Hành", desc: "Thực tế, quyết đoán và giỏi tổ chức. Họ thích quản lý mọi việc theo quy trình rõ ràng.", strengths: ["Tận tụy", "Mạnh mẽ", "Tổ chức tốt"], weaknesses: ["Cứng nhắc", "Khó thư giãn", "Phán xét"] },
    "ESFJ": { title: "Người Chăm Sóc", desc: "Tận tâm, hòa đồng và thích giúp đỡ người khác. Họ coi trọng sự hòa hợp và truyền thống.", strengths: ["Trung thành", "Nhạy cảm", "Giỏi kết nối"], weaknesses: ["Cần được khen", "Thiếu linh hoạt", "Dễ bị chỉ trích"] },
    "ENFJ": { title: "Người Chỉ Dẫn", desc: "Lôi cuốn, đáng tin cậy và giỏi lãnh đạo. Họ luôn nhìn thấy tiềm năng ở người khác.", strengths: ["Khoan dung", "Đáng tin cậy", "Lôi cuốn"], weaknesses: ["Quá duy tâm", "Quá nhạy cảm", "Hay lo lắng"] },
    "ENTJ": { title: "Nhà Lãnh Đạo", desc: "Thẳng thắn, quyết đoán và có khả năng nhìn xa trông rộng. Họ giỏi vạch ra kế hoạch dài hạn.", strengths: ["Hiệu quả", "Tự tin", "Lý trí"], weaknesses: ["Độc đoán", "Kiêu ngạo", "Lạnh lùng"] }
};

const MBTI = () => {
    const [stage, setStage] = useState('welcome'); // welcome, quiz, loading, result
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const startTest = () => setStage('quiz');

    const handleSelect = (value) => {
        const q = questions[currentIndex];
        setAnswers({ ...answers, [q.id]: value });

        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        setStage('loading');
        setTimeout(() => {
            calculateResult();
        }, 2000);
    };

    const calculateResult = () => {
        let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

        questions.forEach(q => {
            let val = answers[q.id] || 3;
            let oppDim = q.dim === 'E' ? 'I' : q.dim === 'N' ? 'S' : q.dim === 'T' ? 'F' : 'P';

            if (q.rev) {
                if (val > 3) scores[oppDim] += (val - 3);
                else if (val < 3) scores[q.dim] += (3 - val);
            } else {
                if (val > 3) scores[q.dim] += (val - 3);
                else if (val < 3) scores[oppDim] += (3 - val);
            }
        });

        let type = "";
        type += scores.E >= scores.I ? "E" : "I";
        type += scores.N >= scores.S ? "N" : "S";
        type += scores.T >= scores.F ? "T" : "F";
        type += scores.J >= scores.P ? "J" : "P";

        setResult({ type, ...types[type] });
        setStage('result');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <div className="glass-card overflow-hidden" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                {stage === 'welcome' && (
                    <div style={{ padding: '3rem', textAlign: 'center' }} className="fade-in">
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧩</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Khám Phá Tính Cách</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
                            Hiểu rõ bản thân hơn để định hướng tương lai và các mối quan hệ hiệu quả.
                        </p>
                        <button className="btn btn-primary" onClick={startTest} style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>Bắt đầu ngay</button>
                        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Thời gian: 5-10 phút • 24 câu hỏi</p>
                    </div>
                )}

                {stage === 'quiz' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '6px', background: '#f1f5f9' }}>
                            <div style={{ height: '100%', background: 'var(--primary)', width: `${(currentIndex / questions.length) * 100}%`, transition: 'width 0.4s' }}></div>
                        </div>
                        <div style={{ padding: '3rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="fade-in">
                            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.1em' }}>CÂU HỎI {currentIndex + 1} / 24</span>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '2rem 0 4rem 0', color: '#1e293b', minHeight: '100px' }}>{questions[currentIndex].text}</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef4444' }}>KHÔNG ĐỒNG Ý</span>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => handleAnswer(v)}
                                            style={{
                                                width: v === 3 ? '30px' : v === 1 || v === 5 ? '50px' : '40px',
                                                height: v === 3 ? '30px' : v === 1 || v === 5 ? '50px' : '40px',
                                                borderRadius: '50%',
                                                border: '2px solid #cbd5e1',
                                                background: answers[questions[currentIndex].id] === v ? 'var(--primary)' : 'white',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#22c55e' }}>ĐỒNG Ý</span>
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'loading' && (
                    <div style={{ padding: '4rem', textAlign: 'center' }} className="fade-in">
                        <div className="loader" style={{ width: '60px', height: '60px', border: '5px solid #f3f3f3', borderTop: '5px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem auto' }}></div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Đang phân tích...</h3>
                        <p style={{ color: 'var(--text-light)' }}>Chúng mình đang tổng hợp kết quả dựa trên các câu trả lời của bạn.</p>
                    </div>
                )}

                {stage === 'result' && result && (
                    <div style={{ padding: '3rem' }} className="fade-in">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-light)' }}>Kết quả của bạn là</span>
                            <h2 style={{ fontSize: '5rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1' }}>{result.type}</h2>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{result.title}</h3>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569' }}>{result.desc}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <h4 style={{ fontWeight: '700', color: '#059669', marginBottom: '1rem' }}>Sức mạnh</h4>
                                <ul style={{ paddingLeft: '1.25rem', color: '#475569' }}>
                                    {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '700', color: '#dc2626', marginBottom: '1rem' }}>Điểm yếu</h4>
                                <ul style={{ paddingLeft: '1.25rem', color: '#475569' }}>
                                    {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-primary" onClick={() => { setStage('welcome'); setAnswers({}); setCurrentIndex(0); }}>Làm lại bài test</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loader { animation: spin 1s linear infinite; }
      `}</style>
        </div>
    );
};

export default MBTI;
