import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    updateProfileInfo,
    changeUserPassword,
    linkGoogleAccount,
    unlinkGoogleAccount,
    getTestHistory,
    auth
} from '../services/firebase';
import './Auth.css';

const Settings = () => {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [testHistory, setTestHistory] = useState([]);

    const [profileData, setProfileData] = useState({
        username: '',
        dob: '',
        gender: '',
        photoURL: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [isUploadedAvatar, setIsUploadedAvatar] = useState(false);

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            getTestHistory(user.uid).then(setTestHistory);
        }
    }, [user]);

    useEffect(() => {
        if (userProfile) {
            setProfileData({
                username: userProfile.username || '',
                dob: userProfile.dob || '',
                gender: userProfile.gender || '',
                photoURL: userProfile.photoURL || ''
            });
            if (userProfile.photoURL?.includes('firebasestorage.googleapis.com')) {
                setIsUploadedAvatar(true);
            }
        }
    }, [userProfile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            let finalPhotoURL = profileData.photoURL;

            if (avatarFile) {
                const { uploadAvatar } = await import('../services/firebase');
                finalPhotoURL = await uploadAvatar(profileData.username, avatarFile);
                setIsUploadedAvatar(true);
                setAvatarFile(null);
            }

            await updateProfileInfo(user.uid, {
                ...profileData,
                photoURL: finalPhotoURL
            });

            setSuccess('Cập nhật thông tin thành công!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setError('Mật khẩu xác nhận không khớp.');
        }
        try {
            setLoading(true);
            setError('');
            await changeUserPassword(passwords.newPassword);
            setSuccess('Đổi mật khẩu thành công!');
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError('Vui lòng đăng nhập lại để thực hiện thay đổi này.');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkGoogle = async () => {
        try {
            setLoading(true);
            setError('');
            await linkGoogleAccount();
            setSuccess('Đã liên kết với Google!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        try {
            setLoading(true);
            setError('');
            await unlinkGoogleAccount();
            setSuccess('Đã hủy liên kết Google.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isGoogleLinked = user?.providerData.some(p => p.providerId === 'google.com');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem', boxSizing: 'border-box', width: '100%', overflowX: 'hidden' }}>
            <h1 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
                Cài đặt & Lịch sử
            </h1>

            {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>⚠️ {error}</div>}
            {success && <div className="auth-success" style={{ marginBottom: '1.5rem' }}>✅ {success}</div>}

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Profile Information */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>👤 Thông tin cá nhân</h2>
                    <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label>ID Người dùng (Username)</label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                placeholder="Username"
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    value={profileData.dob}
                                    onChange={e => setProfileData({ ...profileData, dob: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Giới tính</label>
                                <select
                                    value={profileData.gender}
                                    onChange={e => setProfileData({ ...profileData, gender: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Ảnh đại diện</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={avatarFile ? URL.createObjectURL(avatarFile) : (profileData.photoURL || 'https://via.placeholder.com/150')}
                                        alt="Avatar Preview"
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                setAvatarFile(e.target.files[0]);
                                                setIsUploadedAvatar(true);
                                            }
                                        }}
                                        style={{ fontSize: '0.875rem' }}
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={isUploadedAvatar ? "Đã tải ảnh lên từ thiết bị (Link đã ẩn vì bảo mật)" : profileData.photoURL}
                                        onChange={e => {
                                            setProfileData({ ...profileData, photoURL: e.target.value });
                                            setIsUploadedAvatar(false);
                                            setAvatarFile(null);
                                        }}
                                        placeholder="Hoặc dán link ảnh (URL) tại đây"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            minWidth: 0,
                                            fontStyle: isUploadedAvatar ? 'italic' : 'normal',
                                            color: isUploadedAvatar ? '#64748b' : 'inherit'
                                        }}
                                        readOnly={isUploadedAvatar && avatarFile === null}
                                    />
                                    {isUploadedAvatar && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsUploadedAvatar(false);
                                                setProfileData({ ...profileData, photoURL: '' });
                                                setAvatarFile(null);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}
                                        >
                                            Dùng link
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="auth-button" disabled={loading} style={{ width: 'fit-content', padding: '0.75rem 2rem' }}>
                            {loading ? 'Đang thực hiện...' : 'Lưu thông tin'}
                        </button>
                    </form>
                </div>

                {/* History Section */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>📊 Lịch sử đánh giá</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {testHistory.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>Bạn chưa thực hiện đánh giá nào.</p>
                        ) : (
                            testHistory.map(item => (
                                <div key={item.id} style={{ padding: '1.25rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{item.type}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.createdAt?.toDate().toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{item.title}</h4>
                                    {item.result && (
                                        <div style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                            {item.result}
                                        </div>
                                    )}
                                    {item.score !== undefined && (
                                        <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                                            Điểm: {item.score} / {item.maxScore}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Account Security */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>🔒 Bảo mật</h2>

                    {/* Google Link */}
                    <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Tài khoản Google</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                    {isGoogleLinked ? 'Đang liên kết' : 'Chưa liên kết'}
                                </p>
                            </div>
                            {isGoogleLinked ? (
                                <button onClick={handleUnlinkGoogle} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer' }}>
                                    Hủy liên kết
                                </button>
                            ) : (
                                <button onClick={handleLinkGoogle} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                    Liên kết
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Change Password */}
                    <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem' }}>Đổi mật khẩu</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="auth-button" disabled={loading} style={{ width: 'fit-content', padding: '0.75rem 2rem' }}>
                            Đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
