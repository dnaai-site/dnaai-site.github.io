import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { getGeminiResponse } from '../services/gemini';

const Admin = () => {
    const { user, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [searchId, setSearchId] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const isAuthorized = ['super_admin', 'admin', 'dev'].includes(userProfile?.role);
    const isFullAdmin = ['super_admin', 'admin'].includes(userProfile?.role);
    const isSuperAdmin = userProfile?.role === 'super_admin';

    useEffect(() => {
        if (!isAuthorized) return;

        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        if (activeTab === 'staff' && isSuperAdmin) {
            const fetchStaff = async () => {
                const { getAllStaff } = await import('../services/firebase');
                const list = await getAllStaff();
                setStaffList(list);
            };
            fetchStaff();
        }

        return () => unsubscribe();
    }, [isAuthorized, activeTab, isSuperAdmin]);

    const handleSearch = async () => {
        if (!searchId.trim()) return;
        setIsLoading(true);
        try {
            const q = query(collection(db, "users"), where("username", "==", searchId.trim().toLowerCase()));
            const snap = await getDocs(q);
            if (!snap.empty) {
                setFoundUser({ id: snap.docs[0].id, ...snap.docs[0].data() });
            } else {
                alert("Không tìm thấy người dùng này.");
                setFoundUser(null);
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    };

    const handleBan = async (type) => {
        if (!foundUser || !isFullAdmin) return;
        const reason = prompt("Lý do hạn chế:");
        if (!reason) return;

        try {
            const { banUser } = await import('../services/firebase');
            await banUser(foundUser.uid, {
                type,
                reason,
                evidence: "Admin Manual Action"
            });
            alert("Đã thực hiện hạn chế.");
            handleSearch();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAIAnalyze = async (report) => {
        setIsAnalyzing(true);
        try {
            const prompt = `Phân tích báo cáo vi phạm sau:
            Lý do báo cáo: "${report.reason}"
            Bằng chứng/Nội dung: "${report.evidence}"
            Hãy cho biết báo cáo này có vi phạm tiêu chuẩn cộng đồng không (Thân thiện, không bạo lực, không quấy rối). Trả lời ngắn gọn: "VI PHẠM" hoặc "KHÔNG VI PHẠM" và kèm theo 1 câu giải thích.`;

            const analysis = await getGeminiResponse(prompt);
            await updateDoc(doc(db, "reports", report.id), {
                aiAnalysis: analysis,
                status: 'reviewed'
            });
        } catch (err) {
            console.error(err);
        }
        setIsAnalyzing(false);
    };

    const handleResolveReport = async (reportId, approved) => {
        if (!isFullAdmin) return;
        try {
            await updateDoc(doc(db, "reports", reportId), {
                status: approved ? 'resolved' : 'dismissed'
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoleChange = async (targetId, newRole) => {
        if (!isSuperAdmin) return;
        if (targetId === user.uid) {
            alert("Bạn không thể tự hạ quyền của chính mình.");
            return;
        }
        try {
            const { updateUserRole } = await import('../services/firebase');
            await updateUserRole(targetId, newRole);
            alert("Đã cập nhật vai trò.");
            const { getAllStaff } = await import('../services/firebase');
            const list = await getAllStaff();
            setStaffList(list);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!isAuthorized) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Bạn không có quyền truy cập trang này.</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(1rem, 5vw, 2rem)', width: '100%', boxSizing: 'border-box' }}>
            {/* Header */}
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="hero-gradient-text" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>Quản Trị Hệ Thống</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9375rem' }}>Chào mừng trở lại, {userProfile?.username}</p>
                </div>

                <div style={{
                    display: 'flex',
                    padding: '0.375rem',
                    background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f5f9'
                }}>
                    {['users', 'reports', 'staff'].map((tab) => {
                        if (tab === 'staff' && !isSuperAdmin) return null;
                        const label = tab === 'users' ? 'Người dùng' : tab === 'reports' ? 'Báo cáo' : 'Nhân sự';
                        const count = tab === 'reports' ? reports.filter(r => r.status === 'pending').length : 0;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    background: activeTab === tab ? 'var(--primary)' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#64748b',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {label}
                                {count > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '0.125rem 0.375rem', borderRadius: '99px', fontSize: '0.75rem' }}>{count}</span>}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="admin-content fade-in">
                {activeTab === 'users' && (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '2rem' }}>
                            <input
                                type="text"
                                placeholder="Nhập username để tra cứu..."
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '1rem',
                                    border: '2px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary"
                                disabled={isLoading}
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '0.5rem',
                                    bottom: '0.5rem',
                                    padding: '0 1.5rem',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                {isLoading ? '...' : '🔍 Tìm kiếm'}
                            </button>
                        </div>

                        {foundUser && (
                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={foundUser.photoURL || 'https://via.placeholder.com/150'} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} alt="Avatar" />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 5,
                                            right: 5,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: foundUser.status === 'banned' ? '#ef4444' : '#22c55e',
                                            border: '3px solid white'
                                        }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{foundUser.username}</h3>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                background: foundUser.role === 'super_admin' ? '#4c1d95' : foundUser.role === 'admin' ? '#1e3a8a' : '#f1f5f9',
                                                color: foundUser.role === 'user' ? '#64748b' : 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '99px'
                                            }}>
                                                {foundUser.role.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0', color: '#64748b' }}>{foundUser.email}</p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>ID: {foundUser.uid}</p>
                                    </div>
                                </div>

                                {isFullAdmin && (
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <button onClick={() => handleBan('temporary')} className="btn" style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fef3c7', fontWeight: '700' }}> Khóa tạm thời </button>
                                        <button onClick={() => handleBan('permanent')} className="btn" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: '700' }}> Khóa vĩnh viễn </button>
                                        <button onClick={async () => {
                                            if (confirm("Mở khóa cho người dùng này?")) {
                                                await updateDoc(doc(db, "users", foundUser.uid), { status: 'active', banInfo: null });
                                                handleSearch();
                                            }
                                        }} className="btn" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', fontWeight: '700' }}> Mở khóa </button>
                                    </div>
                                )}

                                {foundUser.status === 'banned' && foundUser.banInfo && (
                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', border: '1px solid #fecaca', borderRadius: '1rem' }}>
                                        <h4 style={{ margin: '0 0 1rem 0', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            ⚠️ Thông tin hạn chế
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Lý do</label>
                                                <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>{foundUser.banInfo.reason}</p>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Ngày thực hiện</label>
                                                <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>{foundUser.banInfo.bannedAt?.toDate().toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reports.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍃</div>
                                <p>Tất cả bình yên. Không có báo cáo nào hiện tại.</p>
                            </div>
                        ) : (
                            reports.map((r) => (
                                <div key={r.id} className="glass-card" style={{
                                    padding: '1.5rem',
                                    background: 'white',
                                    borderLeft: `6px solid ${r.status === 'pending' ? '#ef4444' : r.status === 'resolved' ? '#22c55e' : '#94a3b8'}`,
                                    transition: 'transform 0.2s',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontWeight: '800', color: '#1e293b' }}>Báo cáo: {r.targetUserId}</span>
                                                <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: r.status === 'pending' ? '#fee2e2' : '#f1f5f9', color: r.status === 'pending' ? '#991b1b' : '#64748b', fontWeight: '800' }}>
                                                    {r.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                                                Bởi <strong>{r.reporterId}</strong> • {r.createdAt?.toDate().toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Lý do báo cáo</label>
                                            <p style={{ margin: '0.25rem 0', color: '#1e293b', fontWeight: '600' }}>{r.reason}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Bằng chứng / Nội dung</label>
                                            <p style={{ margin: '0.25rem 0', color: '#475569', fontSize: '0.9375rem', fontStyle: 'italic' }}>"{r.evidence}"</p>
                                        </div>
                                    </div>

                                    {r.aiAnalysis && (
                                        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)', padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '1.25rem' }}>🤖</span>
                                                <strong style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>AI TRỢ LÝ PHÂN TÍCH</strong>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9375rem', color: '#4c1d95', lineHeight: '1.6' }}>{r.aiAnalysis}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {!r.aiAnalysis && (
                                            <button onClick={() => handleAIAnalyze(r)} disabled={isAnalyzing} className="btn" style={{ background: 'white', border: '1.5px solid var(--primary)', color: 'var(--primary)', fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                                                {isAnalyzing ? 'Đang phân tích...' : '🤖 Nhờ AI kiểm tra'}
                                            </button>
                                        )}
                                        {isFullAdmin && r.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleResolveReport(r.id, true)} className="btn btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Duyệt (Có vi phạm)</button>
                                                <button onClick={() => handleResolveReport(r.id, false)} className="btn" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', background: '#94a3b8', color: 'white' }}>Bỏ qua</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'staff' && isSuperAdmin && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Quản lý đội ngũ</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Thiết lập quyền quản trị cho các thành viên nòng cốt của dự án.</p>
                        </div>

                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Nhân sự</th>
                                            <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Email</th>
                                            <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Vai trò</th>
                                            <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staffList.map(staff => (
                                            <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: '#1e293b' }}>{staff.username}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>{staff.email}</td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: '900',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '99px',
                                                        background: staff.role === 'super_admin' ? '#4c1d95' : staff.role === 'admin' ? '#1e3a8a' : '#065f46',
                                                        color: 'white'
                                                    }}>
                                                        {staff.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    {staff.role !== 'super_admin' ? (
                                                        <select
                                                            value={staff.role}
                                                            onChange={(e) => handleRoleChange(staff.uid, e.target.value)}
                                                            style={{
                                                                padding: '0.5rem',
                                                                borderRadius: '0.5rem',
                                                                border: '1px solid #e2e8f0',
                                                                outline: 'none',
                                                                fontSize: '0.875rem',
                                                                background: 'white',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="user">Hạ quyền (User)</option>
                                                            <option value="dev">Nhân viên (Dev)</option>
                                                            <option value="admin">Quản trị viên (Admin)</option>
                                                        </select>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.8125rem', fontStyle: 'italic' }}>Không thể thay đổi</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
