import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
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
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

let app, auth, db, googleProvider;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
} else {
    console.warn('⚠️ Firebase chưa được cấu hình. Tính năng đăng nhập sẽ không hoạt động. Vui lòng thêm VITE_FIREBASE_* vào file .env');
    auth = null;
    db = null;
    googleProvider = null;
}

export { auth, db, googleProvider };

// Custom Auth Functions
export const registerUser = async (userData) => {
    const { id, email, password, dob, gender } = userData;

    // 1. Check if ID already exists
    const idQuery = query(collection(db, "users"), where("username", "==", id));
    const idSnapshot = await getDocs(idQuery);

    if (!idSnapshot.empty) {
        throw new Error("ID đã tồn tại, vui lòng chọn ID khác.");
    }

    // 2. Create user with Email
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Store additional data in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: id,
        email: email,
        dob: dob,
        gender: gender,
        createdAt: new Date().toISOString()
    });

    return user;
};

export const loginWithId = async (idOrEmail, password) => {
    const term = idOrEmail.trim();

    // 1. Tìm thông tin người dùng qua ID (username)
    let idQuery = query(collection(db, "users"), where("username", "==", term));
    let snapshot = await getDocs(idQuery);

    // 2. Nếu không thấy, thử tìm qua Email
    if (snapshot.empty) {
        idQuery = query(collection(db, "users"), where("email", "==", term));
        snapshot = await getDocs(idQuery);
    }

    if (snapshot.empty) {
        throw new Error("ID hoặc Email không tồn tại.");
    }

    const userData = snapshot.docs[0].data();
    const email = userData.email;

    // 3. Đăng nhập thực sự bằng Firebase Auth
    return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if profile exists, if not create a default one
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        // Generate a default username if it's a new Google user
        const defaultUsername = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
        await setDoc(docRef, {
            uid: user.uid,
            username: defaultUsername,
            email: user.email,
            dob: "",
            gender: "",
            createdAt: new Date().toISOString()
        });
    }

    return user;
};

export const logout = () => signOut(auth);
