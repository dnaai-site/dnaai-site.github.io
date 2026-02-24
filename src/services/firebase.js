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
    getDocs
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
import {
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
    increment,
    serverTimestamp
} from "firebase/firestore";

export const registerUser = async (userData) => {
    if (!auth || !db) throw new Error("Firebase chưa được cấu hình.");
    const { id, email, password, dob, gender, avatarFile } = userData;

    // 1. Check if ID already exists
    const idQuery = query(collection(db, "users"), where("username", "==", id.trim().toLowerCase()));
    const idSnapshot = await getDocs(idQuery);

    if (!idSnapshot.empty) {
        throw new Error("ID đã tồn tại, vui lòng chọn ID khác.");
    }

    // 2. Create user with Email
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Upload Avatar if present
    let photoURL = "";
    if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);

        // Cập nhật profile auth
        await updateAuthProfile(user, { photoURL });
    }

    // 4. Send Verification Email (optional, user might want to skip for now)
    // await sendEmailVerification(user);

    // 5. Store additional data in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: id.trim().toLowerCase(),
        email: email,
        dob: dob,
        gender: gender,
        photoURL: photoURL,
        createdAt: serverTimestamp()
    });

    return user;
};

export const loginWithId = async (idOrEmail, password) => {
    if (!auth || !db) throw new Error("Firebase chưa được cấu hình.");
    const term = idOrEmail.trim().toLowerCase();

    let email = term;

    // Nếu không phải email, tìm qua username
    if (!term.includes('@')) {
        const idQuery = query(collection(db, "users"), where("username", "==", term));
        const snapshot = await getDocs(idQuery);

        if (snapshot.empty) {
            throw new Error("ID người dùng không tồn tại.");
        }

        email = snapshot.docs[0].data().email;
    }

    // Đăng nhập bằng Email & Password
    return await signInWithEmailAndPassword(auth, email, password);
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
            createdAt: serverTimestamp()
        });
    }

    return user;
};

// --- Account Management --- //

export const updateProfileInfo = async (uid, data) => {
    const docRef = doc(db, "users", uid);
    if (data.username) data.username = data.username.toLowerCase();
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
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
    }
};

export const addComment = async (postId, commentData) => {
    await addDoc(collection(db, "posts", postId, "comments"), {
        ...commentData,
        createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "posts", postId), {
        commentCount: increment(1)
    });
};

export const subscribeToComments = (postId, callback) => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(comments);
    });
};

export const logout = () => signOut(auth);
