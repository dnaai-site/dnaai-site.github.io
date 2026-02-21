import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithId, loginWithGoogle } from '../services/firebase';
import './Auth.css';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await loginWithId(id, password);
            navigate('/');
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại ID và mật khẩu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Đăng nhập với Google thất bại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Chào mừng trở lại</h1>
                    <p>Đăng nhập để tiếp tục hành trình của bạn</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="id">ID Người dùng</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Nhập ID của bạn"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>hoặc</span>
                </div>

                <button onClick={handleGoogleLogin} className="google-button" disabled={loading}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
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
