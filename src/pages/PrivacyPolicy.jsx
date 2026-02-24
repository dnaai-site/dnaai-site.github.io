import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', color: '#334155', lineHeight: '1.8' }}>
            <h1 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
                Chính sách bảo mật HeartSpace
            </h1>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>1. Thu thập thông tin</h2>
                <p>
                    HeartSpace thu thập các thông tin cơ bản khi bạn đăng ký tài khoản, bao gồm: ID người dùng, email, ngày sinh và giới tính.
                    Chúng tôi cũng lưu trữ các bài đăng và tương tác của bạn trên nền tảng để cung cấp trải nghiệm cộng đồng tốt nhất.
                </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>2. Sử dụng thông tin</h2>
                <p>
                    Thông tin của bạn được sử dụng để:
                </p>
                <ul>
                    <li>Xác thực danh tính và bảo mật tài khoản.</li>
                    <li>Cung cấp tính năng chatbot AI cá nhân hóa.</li>
                    <li>Hiển thị các bài đăng trong cộng đồng một cách an toàn (ẩn danh theo lựa chọn của bạn).</li>
                    <li>Gửi các thông báo quan trọng về hệ thống.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>3. Bảo mật thông tin</h2>
                <p>
                    Chúng tôi sử dụng công nghệ Firebase của Google để lưu trữ và bảo vệ dữ liệu của bạn.
                    Mọi bài đăng trong mục Cộng đồng đều mặc định hiển thị dưới tên "Người dùng ẩn danh" để bảo vệ sự riêng tư tuyệt đối cho cảm xúc của bạn.
                </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>4. Quyền của người dùng</h2>
                <p>
                    Bạn có quyền thay đổi thông tin cá nhân, cập nhật mật khẩu hoặc yêu cầu xóa tài khoản bất cứ lúc nào thông qua trang Cài đặt tài khoản.
                </p>
            </section>

            <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Cập nhật lần cuối: 22 tháng 02, 2026. <br />
                    Mọi thắc mắc vui lòng liên hệ: support@heartspace.vn
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
