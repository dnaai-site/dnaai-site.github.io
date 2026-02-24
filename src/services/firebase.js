import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile as updateAuthProfile
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
    increment,
    serverTimestamp
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app, auth, db, storage, googleProvider;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
} else {
    console.warn('⚠️ Firebase chưa được cấu hình. Tính năng đăng nhập sẽ không hoạt động. Vui lòng thêm VITE_FIREBASE_* vào file .env');
    auth = null;
    db = null;
    storage = null;
    googleProvider = null;
}

const ROLES = {
    SUPER_ADMIN: 'dna.ai.1402@gmail.com',
    ADMINS: ['nhatdang5110.nd@gmail.com', 'nhatdang10.nd@gmail.com'],
};

export const getUserRole = (email) => {
    if (email === ROLES.SUPER_ADMIN) return 'super_admin';
    if (ROLES.ADMINS.includes(email)) return 'admin';
    return 'user';
};

// --- Test Results (MBTI, Stress, Career) --- //

export const saveTestResult = async (uid, resultData) => {
    return await addDoc(collection(db, "users", uid, "test_results"), {
        ...resultData,
        createdAt: serverTimestamp()
    });
};

export const getTestHistory = async (uid) => {
    const q = query(
        collection(db, "users", uid, "test_results"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { auth, db, storage, googleProvider };

// --- Auth Functions --- //

import {
    sendEmailVerification,
    updateEmail,
    updatePassword,
    linkWithPopup,
    unlink,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";

export const registerUser = async (userData) => {
    if (!auth || !db) throw new Error("Firebase chưa được cấu hình.");
    const { id, email, password, dob, gender, avatarFile } = userData;

    const idQuery = query(collection(db, "users"), where("username", "==", id.trim().toLowerCase()));
    const idSnapshot = await getDocs(idQuery);

    if (!idSnapshot.empty) {
        throw new Error("ID đã tồn tại, vui lòng chọn ID khác.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let photoURL = "";
    if (avatarFile) {
        photoURL = await uploadAvatar(id.trim().toLowerCase(), avatarFile);
        await updateAuthProfile(user, { photoURL });
    }

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: id.trim().toLowerCase(),
        email: email,
        dob: dob,
        gender: gender,
        photoURL: photoURL,
        role: getUserRole(email),
        status: 'active',
        lastUsernameChange: serverTimestamp(),
        createdAt: serverTimestamp()
    });

    return user;
};

export const loginWithId = async (idOrEmail, password) => {
    if (!auth || !db) throw new Error("Firebase chưa được cấu hình.");
    const term = idOrEmail.trim().toLowerCase();
    let email = term;

    if (!term.includes('@')) {
        const idQuery = query(collection(db, "users"), where("username", "==", term));
        const snapshot = await getDocs(idQuery);
        if (snapshot.empty) throw new Error("ID người dùng không tồn tại.");
        email = snapshot.docs[0].data().email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userSnap = await getDoc(doc(db, "users", userCredential.user.uid));

    if (userSnap.exists() && userSnap.data().status === 'banned') {
        const banInfo = userSnap.data().banInfo;
        throw new Error(`Tài khoản đã bị khóa. Lý do: ${banInfo.reason}. Loại: ${banInfo.type === 'permanent' ? 'Vĩnh viễn' : 'Có thời hạn'}.`);
    }

    return userCredential;
};

export const loginWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase chưa được cấu hình.");
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        const defaultUsername = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
        await setDoc(docRef, {
            uid: user.uid,
            username: defaultUsername,
            email: user.email,
            dob: "",
            gender: "",
            photoURL: user.photoURL,
            role: getUserRole(user.email),
            status: 'active',
            lastUsernameChange: serverTimestamp(),
            createdAt: serverTimestamp()
        });
    } else if (docSnap.data().status === 'banned') {
        await logout();
        const banInfo = docSnap.data().banInfo;
        throw new Error(`Tài khoản đã bị khóa. Lý do: ${banInfo.reason}.`);
    }

    return user;
};

// --- Account Management --- //

export const uploadAvatar = async (username, file) => {
    if (!storage) throw new Error("Storage chưa được cấu hình.");
    const path = `${username.trim().toLowerCase()}/avatar/${Date.now()}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const updateProfileInfo = async (uid, data) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.data();

    if (data.username && data.username.toLowerCase() !== currentData.username) {
        if (currentData.lastUsernameChange) {
            const lastChange = currentData.lastUsernameChange.toDate();
            const now = new Date();
            const diffDays = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
                throw new Error(`Bạn chỉ có thể đổi ID sau mỗi 7 ngày. (Còn ${7 - diffDays} ngày nữa)`);
            }
        }

        const newUsername = data.username.trim().toLowerCase();
        const idQuery = query(collection(db, "users"), where("username", "==", newUsername));
        const idSnapshot = await getDocs(idQuery);

        if (!idSnapshot.empty && idSnapshot.docs[0].id !== uid) {
            throw new Error("ID (Username) này đã được sử dụng bởi người khác.");
        }
        data.username = newUsername;
        data.lastUsernameChange = serverTimestamp();
    }

    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });

    if (auth.currentUser) {
        const updates = {};
        if (data.photoURL) updates.photoURL = data.photoURL;
        if (data.username) updates.displayName = data.username;
        if (Object.keys(updates).length > 0) {
            await updateAuthProfile(auth.currentUser, updates);
        }
    }
};

export const linkGoogleAccount = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Bạn chưa đăng nhập.");
    return await linkWithPopup(user, googleProvider);
};

export const unlinkGoogleAccount = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Bạn chưa đăng nhập.");
    return await unlink(user, "google.com");
};

export const changeUserPassword = async (newPassword) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Bạn chưa đăng nhập.");
    await updatePassword(user, newPassword);
};

export const changeUserEmail = async (newEmail) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Bạn chưa đăng nhập.");
    await updateEmail(user, newEmail);
    await updateDoc(doc(db, "users", user.uid), { email: newEmail });
};

// --- Community Real-time --- //

export const subscribeToPosts = (callback) => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(posts);
    });
};

export const createPost = async (postData) => {
    return await addDoc(collection(db, "posts"), {
        ...postData,
        likes: 0,
        commentCount: 0,
        likedBy: [],
        createdAt: serverTimestamp()
    });
};

export const toggleLikePost = async (postId, uid) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return;

    const data = postSnap.data();
    const likedBy = data.likedBy || [];
    const isLiked = likedBy.includes(uid);

    if (isLiked) {
        await updateDoc(postRef, {
            likes: increment(-1),
            likedBy: likedBy.filter(id => id !== uid)
        });
    } else {
        await updateDoc(postRef, {
            likes: increment(1),
            likedBy: [...likedBy, uid]
        });
        // Thông báo cho chủ bài viết
        if (data.authorId !== uid) {
            await addNotification(data.authorId, {
                title: 'Có người thích bài viết của bạn',
                message: 'Ai đó vừa thả tim bài viết của bạn. Hãy vào xem nhé!',
                type: 'info',
                link: '/community'
            });
        }
    }
};

export const addComment = async (postId, commentData) => {
    await addDoc(collection(db, "posts", postId, "comments"), {
        ...commentData,
        createdAt: serverTimestamp()
    });
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
        const post = postSnap.data();
        await updateDoc(postRef, {
            commentCount: increment(1)
        });
        // Thông báo cho chủ bài viết
        if (post.authorId !== commentData.authorId && commentData.authorId !== 'ai-bot') {
            await addNotification(post.authorId, {
                title: 'Bình luận mới trên bài viết',
                message: `${commentData.authorName} vừa bình luận: "${commentData.text.substring(0, 30)}..."`,
                type: 'info',
                link: '/community'
            });
        }
    }
};

export const subscribeToComments = (postId, callback) => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(comments);
    });
};

export const deletePost = async (postId, uid) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists() && postSnap.data().authorId === uid) {
        await deleteDoc(postRef);
    } else {
        throw new Error("Bạn không có quyền xóa bài viết này.");
    }
};

// --- AI Chat History --- //

export const saveAIChatMessage = async (uid, message) => {
    await addDoc(collection(db, "users", uid, "ai_chats"), {
        ...message,
        createdAt: serverTimestamp()
    });
};

export const getAIChatHistory = async (uid, limitCount = 20) => {
    const q = query(
        collection(db, "users", uid, "ai_chats"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data()).reverse();
};

// --- Direct Messaging (User to User) --- //

export const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
};

export const sendDirectMessage = async (senderId, receiverId, text) => {
    const chatId = getChatId(senderId, receiverId);
    const chatRef = doc(db, "direct_chats", chatId);

    await setDoc(chatRef, {
        participants: [senderId, receiverId],
        lastMessage: text,
        updatedAt: serverTimestamp()
    }, { merge: true });

    await addDoc(collection(db, "direct_chats", chatId, "messages"), {
        senderId,
        text,
        createdAt: serverTimestamp()
    });

    // Thông báo cho người nhận
    await addNotification(receiverId, {
        title: 'Tin nhắn mới',
        message: text.length > 40 ? text.substring(0, 37) + '...' : text,
        type: 'info',
        link: `/messages/${senderId}`
    });
};

export const subscribeToDirectChat = (uid1, uid2, callback) => {
    const chatId = getChatId(uid1, uid2);
    const q = query(
        collection(db, "direct_chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};

// --- Admin & Moderation --- //

export const reportUser = async (reporterId, targetUserId, reason, evidence) => {
    return await addDoc(collection(db, "reports"), {
        reporterId,
        targetUserId,
        reason,
        evidence,
        status: 'pending',
        aiAnalysis: '',
        createdAt: serverTimestamp()
    });
};

export const banUser = async (targetUserId, banData) => {
    const userRef = doc(db, "users", targetUserId);
    await updateDoc(userRef, {
        status: 'banned',
        banInfo: {
            ...banData,
            bannedAt: serverTimestamp()
        }
    });

    await addNotification(targetUserId, {
        title: 'Tài khoản của bạn đã bị hạn chế',
        message: `Lý do: ${banData.reason}. Loại: ${banData.type === 'permanent' ? 'Vĩnh viễn' : 'Có thời hạn'}.`,
        type: 'alert'
    });
};

export const addNotification = async (uid, notification) => {
    await addDoc(collection(db, "users", uid, "notifications"), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
    });
};

export const markNotificationAsRead = async (uid, notificationId) => {
    const docRef = doc(db, "users", uid, "notifications", notificationId);
    await updateDoc(docRef, { read: true });
};

export const clearAllNotifications = async (uid) => {
    const q = query(collection(db, "users", uid, "notifications"), where("read", "==", false));
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(d => updateDoc(d.ref, { read: true }));
    await Promise.all(promises);
};

export const subscribeToNotifications = (uid, callback) => {
    const q = query(
        collection(db, "users", uid, "notifications"),
        orderBy("createdAt", "desc"),
        limit(20)
    );
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

// --- Staff Management (SuperAdmin only) --- //

export const getAllStaff = async () => {
    const q = query(collection(db, "users"), where("role", "in", ["super_admin", "admin", "dev"]));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserRole = async (targetUserId, newRole) => {
    // Only super_admin should call this from the UI
    const docRef = doc(db, "users", targetUserId);
    await updateDoc(docRef, { role: newRole });
};

export const logout = () => signOut(auth);
