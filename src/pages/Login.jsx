import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithId, loginWithGoogle } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import './Auth.css';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if already logged in
    if (user) {
        navigate('/');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!auth) {
            setError('Firebase chưa được cấu hình. Vui lòng kiểm tra biến môi trường VITE_FIREBASE_*.');
            return;
        }
        try {
            setError('');
            setLoading(true);
            await loginWithId(id, password);
            navigate('/');
        } catch (err) {
            const code = err.code || '';
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
                setError('Mật khẩu hoặc email không đúng. Vui lòng thử lại.');
            } else if (code === 'auth/user-not-found' || err.message === 'ID người dùng không tồn tại.') {
                setError('Tài khoản không tồn tại. Hãy kiểm tra lại ID hoặc đăng ký mới.');
            } else if (code === 'auth/too-many-requests') {
                setError('Quá nhiều lần thử sai. Vui lòng thử lại sau vài phút.');
            } else if (code === 'auth/network-request-failed') {
                setError('Lỗi kết nối mạng. Vui lòng kiểm tra internet.');
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }
            console.error('[Login Error]', err.code, err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!auth) {
            setError('Firebase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.');
            return;
        }
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
                setError('');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup bị chặn. Vui lòng cho phép popup trong trình duyệt.');
            } else {
                setError('Đăng nhập với Google thất bại. Vui lòng thử lại.');
            }
            console.error('[Google Login Error]', err.code, err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }} />
                    </div>
                    <h1>Chào mừng trở lại</h1>
                    <p>Đăng nhập để tiếp tục hành trình của bạn</p>
                </div>

                {error && <div className="auth-error">⚠️ {error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login-id">ID hoặc Email</label>
                        <input
                            type="text"
                            id="login-id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Nhập ID hoặc Email của bạn"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Mật khẩu</label>
                        <input
                            type="password"
                            id="login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading"><span></span><span></span><span></span></span>
                        ) : 'Đăng nhập'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>hoặc</span>
                </div>

                <button onClick={handleGoogleLogin} className="google-button" disabled={loading}>
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Đăng nhập với Google
                </button>

                <div className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
