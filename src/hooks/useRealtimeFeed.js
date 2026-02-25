import { useState, useEffect } from 'react';
import { rtdb } from '../services/firebase';
import { ref, query, orderByChild, limitToLast, onValue, off } from 'firebase/database';

/**
 * Hook to subscribe to the discovery feed of posts.
 * @param {number} limitCount - Number of recent posts to fetch.
 */
export const useRealtimeFeed = (limitCount = 50) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!rtdb) return;

        const postsRef = ref(rtdb, 'posts');
        const postsQuery = query(postsRef, orderByChild('createdAt'), limitToLast(limitCount));

        const handleData = (snapshot) => {
            const postsArray = [];
            snapshot.forEach((childSnapshot) => {
                postsArray.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            setPosts(postsArray);
            setLoading(false);
        };

        const handleError = (err) => {
            console.error("Feed Subscribe Error:", err);
            setError(err);
            setLoading(false);
        };

        // Use onValue for the entire set to keep it simple for now as requested
        // For performance on large lists, child-based listeners would be better
        onValue(postsQuery, handleData, handleError);

        return () => {
            off(postsQuery);
        };
    }, [limitCount]);

    return { posts, loading, error };
};
