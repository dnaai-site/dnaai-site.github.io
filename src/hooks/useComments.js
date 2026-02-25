import { useState, useEffect } from 'react';
import { rtdb } from '../services/firebase';
import { ref, query, onValue, off, orderByChild } from 'firebase/database';

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!rtdb || !postId) return;

        const commentsRef = ref(rtdb, `comments/${postId}`);
        const commentsQuery = query(commentsRef, orderByChild('createdAt'));

        const unsubscribe = onValue(commentsQuery, (snapshot) => {
            const commentsArray = [];
            snapshot.forEach((child) => {
                commentsArray.push({
                    id: child.key,
                    ...child.val()
                });
            });
            setComments(commentsArray);
            setLoading(false);
        });

        return () => off(commentsRef, 'value', unsubscribe);
    }, [postId]);

    return { comments, loading };
};

export const useReplies = (parentId) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!rtdb || !parentId) return;

        const repliesRef = ref(rtdb, `replies/${parentId}`);
        const repliesQuery = query(repliesRef, orderByChild('createdAt'));

        const unsubscribe = onValue(repliesQuery, (snapshot) => {
            const repliesArray = [];
            snapshot.forEach((child) => {
                repliesArray.push({
                    id: child.key,
                    ...child.val()
                });
            });
            setReplies(repliesArray);
            setLoading(false);
        });

        return () => off(repliesRef, 'value', unsubscribe);
    }, [parentId]);

    return { replies, loading };
};
