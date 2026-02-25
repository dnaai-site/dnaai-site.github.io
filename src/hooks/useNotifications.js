import { useState, useEffect } from 'react';
import { rtdb } from '../services/firebase';
import { ref, onValue, off, query, limitToLast } from 'firebase/database';

export const useNotifications = (uid) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!rtdb || !uid) return;

        const notifRef = ref(rtdb, `notifications/${uid}`);
        const notifQuery = query(notifRef, limitToLast(50));

        const unsubscribe = onValue(notifQuery, (snapshot) => {
            const notifArray = [];
            let unread = 0;
            snapshot.forEach((child) => {
                const data = child.val();
                notifArray.unshift({
                    id: child.key,
                    ...data
                });
                if (!data.read) unread++;
            });
            setNotifications(notifArray);
            setUnreadCount(unread);
        });

        return () => off(notifRef, 'value', unsubscribe);
    }, [uid]);

    return { notifications, unreadCount };
};
