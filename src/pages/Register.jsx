import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/firebase';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        dob: '',
        gender: 'other'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.email.includes('@')) {
            setError('Vui lòng nhập email hợp lệ.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await registerUser(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Tạo tài khoản</h1>
                    <p>Tham gia cộng đồng DNA AI ngay hôm nay</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="id">ID Người dùng (Dùng để đăng nhập)</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Ví dụ: nhatdang123"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email (Bắt buộc)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Tối thiểu 6 ký tự"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dob">Ngày sinh</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
