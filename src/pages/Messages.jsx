import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    sendDirectMessage,
    subscribeToDirectChat,
    db
} from '../services/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const Messages = () => {
    const { userId: activeChatPartnerId } = useParams();
    const { user, userProfile } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatList, setChatList] = useState([]);
    const [partnerProfile, setPartnerProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Subscribe to chat list
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "direct_chats"),
            where("participants", "array-contains", user.uid),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chats = [];
            for (const d of snapshot.docs) {
                const data = d.data();
                const partnerId = data.participants.find(p => p !== user.uid);
                // Get partner info
                const partnerSnap = await getDoc(doc(db, "users", partnerId));
                chats.push({
                    id: d.id,
                    partnerId,
                    partnerName: partnerSnap.exists() ? partnerSnap.data().username : 'Người dùng',
                    partnerAvatar: partnerSnap.exists() ? partnerSnap.data().photoURL : '',
                    lastMessage: data.lastMessage,
                    updatedAt: data.updatedAt
                });
            }
            setChatList(chats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. Fetch active partner profile
    useEffect(() => {
        if (activeChatPartnerId) {
            const fetchPartner = async () => {
                const snap = await getDoc(doc(db, "users", activeChatPartnerId));
                if (snap.exists()) setPartnerProfile(snap.data());
            };
            fetchPartner();
        }
    }, [activeChatPartnerId]);

    // 3. Subscribe to active chat messages
    useEffect(() => {
        if (user && activeChatPartnerId) {
            const unsubscribe = subscribeToDirectChat(user.uid, activeChatPartnerId, (data) => {
                setMessages(data);
            });
            return () => unsubscribe();
        }
    }, [user, activeChatPartnerId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !activeChatPartnerId) return;

        try {
            await sendDirectMessage(user.uid, activeChatPartnerId, newMessage.trim());
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Vui lòng đăng nhập để xem tin nhắn.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 160px)', display: 'flex', gap: '1rem', padding: '1rem' }} className="messages-container">
            {/* Sidebar - Chat List */}
            <div className="glass-card" style={{ width: '300px', display: activeChatPartnerId ? 'none' : 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', overflowY: 'auto' }} id="sidebar">
                <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Tin nhắn</h3>
                {chatList.length === 0 && !loading && (
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center' }}>Chưa có cuộc hội thoại nào.</p>
                )}
                {chatList.map(chat => (
                    <div
                        key={chat.id}
                        onClick={() => navigate(`/messages/${chat.partnerId}`)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            background: chat.partnerId === activeChatPartnerId ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                        onMouseOut={e => e.currentTarget.style.background = chat.partnerId === activeChatPartnerId ? 'rgba(139, 92, 246, 0.1)' : 'transparent'}
                    >
                        {chat.partnerAvatar ? (
                            <img src={chat.partnerAvatar} alt={chat.partnerName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                {chat.partnerName[0].toUpperCase()}
                            </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{chat.partnerName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.lastMessage}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div className="glass-card" style={{ flex: 1, display: activeChatPartnerId ? 'flex' : 'none', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {!activeChatPartnerId ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        Chọn một cuộc hội thoại để bắt đầu
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button onClick={() => navigate('/messages')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.5rem' }} id="back-btn">←</button>
                            {partnerProfile?.photoURL ? (
                                <img src={partnerProfile.photoURL} alt={partnerProfile.username} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.75rem' }}>
                                    {partnerProfile?.username?.[0].toUpperCase() || 'U'}
                                </div>
                            )}
                            <span style={{ fontWeight: '800', color: '#1e293b' }}>{partnerProfile?.username || 'Đang tải...'}</span>
                        </div>

                        {/* Messages Feed */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{
                                    alignSelf: m.senderId === user.uid ? 'flex-end' : 'flex-start',
                                    background: m.senderId === user.uid ? 'var(--primary)' : 'white',
                                    color: m.senderId === user.uid ? 'white' : '#1e293b',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '1rem',
                                    maxWidth: '80%',
                                    fontSize: '0.875rem',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    borderBottomRightRadius: m.senderId === user.uid ? '0.25rem' : '1rem',
                                    borderBottomLeftRadius: m.senderId === user.uid ? '1rem' : '0.25rem'
                                }}>
                                    {m.text}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} style={{ padding: '1rem', display: 'flex', gap: '0.5rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Viết tin nhắn..."
                                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '99px', border: '1.5px solid #e2e8f0', outline: 'none' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ✈️
                            </button>
                        </form>
                    </>
                )}
            </div>

            <style>{`
                @media (min-width: 768px) {
                    #sidebar { display: flex !important; }
                    .glass-card { display: flex !important; }
                    #back-btn { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Messages;
