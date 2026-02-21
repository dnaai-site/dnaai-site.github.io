import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    updateProfileInfo,
    changeUserPassword,
    changeUserEmail,
    linkGoogleAccount,
    unlinkGoogleAccount,
    auth
} from '../services/firebase';
import './Auth.css';

const Settings = () => {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [profileData, setProfileData] = useState({
        username: '',
        dob: '',
        gender: '',
        photoURL: ''
    });

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        if (userProfile) {
            setProfileData({
                username: userProfile.username || '',
                dob: userProfile.dob || '',
                gender: userProfile.gender || '',
                photoURL: userProfile.photoURL || ''
            });
            setNewEmail(userProfile.email || '');
        }
    }, [userProfile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await updateProfileInfo(user.uid, profileData);
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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <h1 className="hero-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>
                Cài đặt tài khoản
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                            <label>Link ảnh đại diện (URL)</label>
                            <input
                                type="text"
                                value={profileData.photoURL}
                                onChange={e => setProfileData({ ...profileData, photoURL: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={loading} style={{ width: 'fit-content', padding: '0.75rem 2rem' }}>
                            Lưu thông tin
                        </button>
                    </form>
                </div>

                {/* Account Security */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>🔒 Bảo mật</h2>

                    {/* Google Link */}
                    <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Tài khoản Google</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                    {isGoogleLinked ? 'Đang liên kết' : 'Chưa liên kết'}
                                </p>
                            </div>
                            {isGoogleLinked ? (
                                <button onClick={handleUnlinkGoogle} className="btn" style={{ padding: '0.5rem 1rem', border: '1px solid #ef4444', color: '#ef4444' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    required
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
