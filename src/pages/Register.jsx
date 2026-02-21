import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `2px solid ${open ? '#8b5cf6' : '#e2e8f0'}`,
                    borderRadius: '0.875rem',
                    fontSize: '0.9375rem',
                    color: '#1e293b',
                    background: open ? 'white' : '#f8fafc',
                    boxShadow: open ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: '600',
                    textAlign: 'left',
                }}
            >
                <span>{selected?.label}</span>
                <svg
                    width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                    style={{
                        color: '#8b5cf6',
                        transition: 'transform 0.2s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0
                    }}
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.875rem',
                    boxShadow: '0 10px 30px -8px rgba(0,0,0,0.15)',
                    zIndex: 50,
                    overflow: 'hidden',
                    animation: 'dropdownIn 0.12s ease-out',
                }}>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: value === opt.value ? 'rgba(139, 92, 246, 0.08)' : 'white',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.9375rem',
                                fontWeight: value === opt.value ? '700' : '500',
                                color: value === opt.value ? '#7c3aed' : '#374151',
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.15s',
                            }}
                            onMouseOver={e => { if (value !== opt.value) e.currentTarget.style.background = '#f5f3ff'; }}
                            onMouseOut={e => { if (value !== opt.value) e.currentTarget.style.background = 'white'; }}
                        >
                            <span>{opt.emoji}</span>
                            {opt.label}
                            {value === opt.value && (
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ marginLeft: 'auto', color: '#7c3aed' }}>
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const genderOptions = [
    { value: 'male', label: 'Nam', emoji: '👦' },
    { value: 'female', label: 'Nữ', emoji: '👧' },
    { value: 'other', label: 'Khác / Không muốn nói', emoji: '🌈' },
];

const Register = () => {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: 'other'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    if (user) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateId = (id) => {
        if (id.length < 4) return 'ID phải có ít nhất 4 ký tự.';
        if (!/^[a-zA-Z0-9_]+$/.test(id)) return 'ID chỉ được chứa chữ cái, số và dấu gạch dưới.';
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const idError = validateId(formData.id);
        if (idError) { setError(idError); return; }
        if (!formData.email.includes('@')) { setError('Vui lòng nhập email hợp lệ.'); return; }
        if (formData.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
        if (formData.password !== formData.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
        if (!formData.dob) { setError('Vui lòng nhập ngày sinh.'); return; }

        try {
            setError('');
            setLoading(true);
            await registerUser(formData);
            setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Email này đã được sử dụng. Vui lòng dùng email khác.');
            } else {
                setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
            console.error(err);
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
                    <h1>Tạo tài khoản</h1>
                    <p>Tham gia cộng đồng HeartSpace ngay hôm nay</p>
                </div>

                {error && <div className="auth-error">⚠️ {error}</div>}
                {success && <div className="auth-success">✅ {success}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="reg-id">ID Người dùng <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                            type="text"
                            id="reg-id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Ví dụ: nhatdang123 (dùng để đăng nhập)"
                            required
                            autoComplete="username"
                        />
                        <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Chỉ chứa chữ cái, số và dấu gạch dưới</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">Email <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                            type="email"
                            id="reg-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="reg-password">Mật khẩu <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="password"
                                id="reg-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                required
                                minLength="6"
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-confirm">Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="password"
                                id="reg-confirm"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="reg-dob">Ngày sinh <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="date"
                                id="reg-dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label>Giới tính</label>
                            <CustomSelect
                                value={formData.gender}
                                onChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}
                                options={genderOptions}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#64748b' }}>
                            <input
                                type="checkbox"
                                required
                                style={{ marginTop: '0.25rem', cursor: 'pointer', width: '1.125rem', height: '1.125rem', accentColor: 'var(--primary)' }}
                            />
                            <span>
                                Tôi đã đọc và đồng ý với <Link to="/privacy" target="_blank" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Chính sách bảo mật</Link> của HeartSpace.
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading"><span></span><span></span><span></span></span>
                        ) : 'Tạo tài khoản'}
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
