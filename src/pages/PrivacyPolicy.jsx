import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', color: '#334155', lineHeight: '1.8' }}>
            <h1 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
                Chính sách bảo mật HeartSpace
            </h1>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>1. Thu thập và Lưu trữ thông tin</h2>
                <p>
                    HeartSpace thu thập các thông tin sau để đảm bảo hệ thống vận hành ổn định:
                </p>
                <ul>
                    <li><strong>Thông tin tài khoản:</strong> ID người dùng (Username), Email, Ngày sinh và Giới tính.</li>
                    <li><strong>Ảnh đại diện (Avatar):</strong> Khi bạn tải lên, ảnh được lưu trữ an toàn trên Firebase Storage dưới cấu trúc thư mục riêng biệt <code>/username/avatar/</code>. Để bảo mật, đường dẫn trực tiếp đến kho lưu trữ sẽ được ẩn trên giao diện cá nhân.</li>
                    <li><strong>Dữ liệu hội thoại:</strong> Lịch sử nhắn tin cá nhân với HeartAI được lưu lại để cải thiện trải nghiệm và giúp bạn theo dõi quá trình tâm lý của mình.</li>
                    <li><strong>Tin nhắn trực tiếp:</strong> Hệ thống lưu trữ tin nhắn giữa những người dùng để đảm bảo khả năng kết nối đồng bộ.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>2. Quy định về ID Người dùng</h2>
                <p>
                    Để tránh việc lạm dụng hệ thống và duy trì tính nhất quán của cộng đồng:
                </p>
                <ul>
                    <li>Bạn chỉ có quyền thay đổi ID (Username) duy nhất 1 lần trong mỗi <strong>7 ngày</strong>.</li>
                    <li>ID mới không được trùng với các ID đã tồn tại hoặc nằm trong danh sách đen (Blacklist).</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>3. Tiêu chuẩn Cộng đồng & Kiểm duyệt</h2>
                <p>
                    HeartSpace sử dụng hệ thống kiểm duyệt đa lớp để duy trì không gian an toàn:
                </p>
                <ul>
                    <li><strong>Hệ thống Báo cáo:</strong> Người dùng có quyền báo cáo bài viết vi phạm (quấy rối, ngôn từ thù ghét, nội dung không phù hợp).</li>
                    <li><strong>AI Giám sát:</strong> AI sẽ tự động phân tích các nội dung bị báo cáo để đưa ra nhận định sơ bộ về mức độ vi phạm giúp Admin xử lý nhanh chóng.</li>
                    <li><strong>Đội ngũ quản trị:</strong> Hệ thống phân cấp Admin và Dev sẽ trực tiếp giám sát và xử lý các hành vi vi phạm tiêu chuẩn cộng đồng.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>4. Chính sách Hạn chế Tài khoản (Ban)</h2>
                <p>
                    Tùy theo mức độ vi phạm, Admin có quyền áp dụng các mức hạn chế:
                </p>
                <ul>
                    <li><strong>Hạn chế có thời hạn:</strong> Tài khoản bị khóa trong một khoảng thời gian cố định.</li>
                    <li><strong>Hạn chế vĩnh viễn:</strong> Tài khoản bị đóng hoàn toàn.
                        <ul>
                            <li>Dữ liệu cá nhân (Email, Avatar, DOB) sẽ bị xóa sạch khỏi máy chủ chính sau <strong>30 ngày</strong>.</li>
                            <li><strong>Lưu lịch sử:</strong> HeartSpace lưu trữ ID và lý do khóa vĩnh viễn để chặn việc tái sử dụng ID đó trong tương lai.</li>
                        </ul>
                    </li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>5. Chia sẻ thông tin</h2>
                <p>
                    Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên thứ ba. Dữ liệu chỉ được xử lý bởi:
                </p>
                <ul>
                    <li>Firebase (Google Cloud) cho mục đích lưu trữ và bảo mật.</li>
                    <li>Gemini API (Google AI) cho mục đích phân tích tâm lý và chatbot (Dữ liệu gửi đi dưới dạng ẩn danh).</li>
                </ul>
            </section>

            <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Cập nhật lần cuối: 24 tháng 02, 2026. <br />
                    Mọi thắc mắc vui lòng liên hệ Admin qua Email: <strong>dna.ai.1402@gmail.com</strong>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
