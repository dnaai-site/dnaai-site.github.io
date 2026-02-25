import { useState, useCallback } from 'react';
import { searchUsers } from '../services/firebase';

export const useMentions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionRange, setMentionRange] = useState(null);

    const handleInputChange = useCallback(async (text, cursorPosition) => {
        const textBeforeCursor = text.substring(0, cursorPosition);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            const searchTerm = mentionMatch[1];
            const users = await searchUsers(searchTerm);

            // Add AI to suggestions if searchTerm matches "ai" or "heart"
            const aiSuggestion = {
                uid: 'ai-bot',
                username: 'AI',
                isAI: true
            };

            const filteredUsers = users.map(u => ({
                uid: u.uid,
                username: u.username
            }));

            if ('ai'.startsWith(searchTerm.toLowerCase())) {
                setSuggestions([aiSuggestion, ...filteredUsers]);
            } else {
                setSuggestions(filteredUsers);
            }

            setShowSuggestions(true);
            setMentionRange({
                start: cursorPosition - mentionMatch[0].length,
                end: cursorPosition
            });
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
            setMentionRange(null);
        }
    }, []);

    return {
        suggestions,
        showSuggestions,
        mentionRange,
        handleInputChange,
        setShowSuggestions
    };
};
