import { useState, useEffect } from 'react';
import { rtdb } from '../services/firebase';
import { ref, onValue, off } from 'firebase/database';

export const useFollowings = (uid) => {
    const [followings, setFollowings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!rtdb || !uid) {
            setLoading(false);
            return;
        }

        const followRef = ref(rtdb, `follows/${uid}`);

        const unsubscribe = onValue(followRef, (snapshot) => {
            const data = snapshot.val() || {};
            setFollowings(data);
            setLoading(false);
        });

        return () => off(followRef, 'value', unsubscribe);
    }, [uid]);

    return { followings, loading };
};
