import { useCallback } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { rtdb } from '../services/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

export const useAIResponder = () => {
    const respondToPost = useCallback(async (postId, postText) => {
        if (!postId || !postText) return;

        // Logic check for @AI tag
        const lowerText = postText.toLowerCase();
        const isTagged = lowerText.includes('@ai') || lowerText.includes('@heartai');

        if (isTagged || postText.length > 15) {
            const aiPrompt = isTagged
                ? `Bạn là HeartAI, một người bạn thấu cảm. Người dùng vừa nhắc đến bạn: "${postText}". Hãy trả lời họ thật ấm áp và chân thành.`
                : `Phân tích bài đăng này: "${postText}". Nếu nội dung thể hiện sự buồn bã, trầm cảm, cô đơn, stress cao hoặc cần tâm sự, hãy viết một phản hồi đồng cảm ngắn gọn (dưới 60 từ) để vỗ về họ. Nếu không cần thiết (vui vẻ, bình thường), hãy trả lời chính xác từ "NONE".`;

            try {
                // Thêm độ trễ tự nhiên 3-6s
                const delay = Math.floor(Math.random() * 3000) + 3000;
                await new Promise(resolve => setTimeout(resolve, delay));

                const aiResponse = await getGeminiResponse(aiPrompt);

                if (aiResponse && aiResponse.trim() !== "NONE") {
                    const commentsRef = ref(rtdb, `comments/${postId}`);
                    const newCommentRef = push(commentsRef);

                    await set(newCommentRef, {
                        id: newCommentRef.key,
                        text: aiResponse,
                        authorId: 'ai-bot',
                        authorName: 'HeartAI ✨',
                        isAI: true,
                        createdAt: serverTimestamp(),
                        depth: 0
                    });

                    // Cập nhật count (đơn giản hóa)
                    // ... (Logic này nên được gộp vào server side hoặc transaction)
                }
            } catch (err) {
                console.error("AI Responder Error:", err);
            }
        }
    }, []);

    return { respondToPost };
};
