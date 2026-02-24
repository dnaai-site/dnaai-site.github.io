import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
    const [path, setPath] = useState(['Hỗ trợ']);

    const crumbs = [
        { label: 'Hỗ trợ', key: 'root' },
        { label: 'Tài khoản', key: 'account' },
        { label: 'Hạn chế', key: 'restriction' },
        { label: 'Vĩnh viễn', key: 'permanent' }
    ];

    const [activeKey, setActiveKey] = useState('root');

    const renderContent = () => {
        switch (activeKey) {
            case 'root':
                return (
                    <div className="support-menu">
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Chào bạn, chúng mình có thể giúp gì?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            <div className="glass-card clickable" onClick={() => setActiveKey('account')} style={{ padding: '1.5rem' }}>
                                <h3>👤 Quản lý tài khoản</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>ID, mật khẩu, thông tin cá nhân và bảo mật.</p>
                            </div>
                            <div className="glass-card clickable" style={{ padding: '1.5rem' }}>
                                <h3>📱 Tính năng & Ứng dụng</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Hướng dẫn sử dụng các công cụ tâm lý của dự án.</p>
                            </div>
                            <div className="glass-card clickable" style={{ padding: '1.5rem' }}>
                                <h3>🤝 Cộng đồng HeartSpace</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Quy tắc ứng xử và giải quyết tranh chấp.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div className="support-menu">
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>👤 Tài khoản</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="glass-card clickable" style={{ padding: '1rem 1.5rem' }}>Thay đổi mật khẩu</div>
                            <div className="glass-card clickable" style={{ padding: '1rem 1.5rem' }}>Đổi ID và Avatar</div>
                            <div className="glass-card clickable" onClick={() => setActiveKey('restriction')} style={{ padding: '1rem 1.5rem', borderLeft: '4px solid #ef4444' }}>Hạn chế & Khóa tài khoản</div>
                            <button className="btn" onClick={() => setActiveKey('root')} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>← Quay lại</button>
                        </div>
                    </div>
                );
            case 'restriction':
                return (
                    <div className="support-menu">
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800', color: '#ef4444' }}>🚫 Hạn chế tài khoản</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Tài khoản bị hạn chế khi vi phạm tiêu chuẩn cộng đồng hoặc có dấu hiệu bất thường.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="glass-card clickable" style={{ padding: '1rem 1.5rem' }}>Báo cáo vi phạm là gì?</div>
                            <div className="glass-card clickable" style={{ padding: '1rem 1.5rem' }}>Hạn chế có thời hạn</div>
                            <div className="glass-card clickable" onClick={() => setActiveKey('permanent')} style={{ padding: '1rem 1.5rem', background: '#fff1f2' }}>Hạn chế vĩnh viễn</div>
                            <button className="btn" onClick={() => setActiveKey('account')} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>← Quay lại</button>
                        </div>
                    </div>
                );
            case 'permanent':
                return (
                    <div className="support-menu">
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: '800', color: '#be123c' }}>⚖️ Hạn chế vĩnh viễn</h2>
                        <div className="glass-card" style={{ padding: '2rem', lineHeight: '1.6' }}>
                            <p>Tài khoản bị hạn chế vĩnh viễn khi vi phạm nghiêm trọng các tiêu chuẩn cộng đồng của HeartSpace.</p>
                            <h4 style={{ marginTop: '1.5rem' }}>Dữ liệu của tôi sẽ thế nào?</h4>
                            <p style={{ fontSize: '0.9375rem', color: '#4b5563' }}>
                                - Mọi thông tin tài khoản (Email, DOB, Avatar) sẽ bị xóa khỏi hệ thống sau **30 ngày** kể từ khi bị ban vĩnh viễn.
                                <br />
                                - Tuy nhiên, **ID (Username) và Email** sẽ được lưu lại trong danh sách đen (Blacklist) để ngăn chặn việc tái sử dụng.
                                <br />
                                - Nếu bạn truy cập vào sau 1 tháng, hệ thống vẫn sẽ nhận diện được trạng thái bị ban của bạn thông qua các định danh cơ bản này.
                            </p>
                            <h4 style={{ marginTop: '1.5rem' }}>Tôi có thể khiếu nại không?</h4>
                            <p style={{ fontSize: '0.9375rem', color: '#4b5563' }}>
                                Bạn có thể liên hệ với đội ngũ Admin (dna.ai.1402@gmail.com) để cung cấp thêm bằng chứng nếu cho rằng có sự nhầm lẫn. Đội ngũ kỹ thuật có lưu lại lý do và bằng chứng cụ thể cho mọi lệnh ban.
                            </p>
                            <button className="btn" onClick={() => setActiveKey('restriction')} style={{ marginTop: '1.5rem' }}>← Quay lại</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            {/* Custom Breadcrumb */}
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '2rem', color: '#94a3b8', fontWeight: '600' }}>
                <span onClick={() => setActiveKey('root')} style={{ cursor: 'pointer', color: activeKey === 'root' ? 'var(--primary)' : 'inherit' }}>Hỗ trợ</span>
                <span>/</span>
                <span onClick={() => activeKey !== 'root' && setActiveKey('account')} style={{ cursor: 'pointer', color: activeKey === 'account' ? 'var(--primary)' : 'inherit' }}>Tài khoản</span>
                {(activeKey === 'restriction' || activeKey === 'permanent') && (
                    <>
                        <span>/</span>
                        <span onClick={() => setActiveKey('restriction')} style={{ cursor: 'pointer', color: activeKey === 'restriction' ? 'var(--primary)' : 'inherit' }}>Hạn chế</span>
                    </>
                )}
                {activeKey === 'permanent' && (
                    <>
                        <span>/</span>
                        <span style={{ color: 'var(--primary)' }}>Vĩnh viễn</span>
                    </>
                )}
            </div>

            {renderContent()}

            <style>{`
                .support-menu h3 { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; }
                .clickable { cursor: pointer; transition: all 0.2s; }
                .clickable:hover { transform: translateY(-2px); border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            `}</style>
        </div>
    );
};

export default Support;
