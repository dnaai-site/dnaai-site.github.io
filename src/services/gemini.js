const MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-experimental-02-05"
];

export const getGeminiResponse = async (userMessage, history = []) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) return "Lỗi: Chưa nạp được API Key.";

    // Lấy 6 tin nhắn gần nhất để giữ ngữ cảnh cuộc trò chuyện
    const chatHistory = history.slice(-6).map(msg => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
    }));

    const systemInstruction = `Bạn là HeartAI - chuyên gia tư vấn tâm lý của HeartSpace. Bạn là một người bạn đồng hành ấm áp, thấu cảm và sâu sắc. 
Nhiệm vụ của bạn:
1. Lắng nghe chân thành và phản hồi bằng ngôn ngữ tự nhiên, gần gũi như một người bạn thực thụ. 
2. Không bao giờ trả lời quá ngắn gọn hoặc chỉ lặp lại ý của người dùng. Hãy đặt câu hỏi gợi mở để người dùng chia sẻ thêm.
3. Luôn sử dụng những câu nói mang tính khích lệ, an ủi và thấu hiểu cảm xúc.
4. Nếu người dùng buồn, hãy cùng họ tìm ra những niềm vui nhỏ bé hoặc đưa ra lời khuyên nhẹ nhàng. 
Hãy bắt đầu cuộc trò chuyện bằng sự chân thành nhất.`;

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}` }]
            },
            {
                role: "model",
                parts: [{ text: "Tôi đã hiểu rõ vai trò của mình. Tôi là HeartSpace, người bạn đồng hành tâm lý của bạn. Tôi sẽ luôn lắng nghe và cùng bạn chia sẻ mọi nỗi lòng một cách ấm áp nhất." }]
            },
            ...chatHistory,
            {
                role: "user",
                parts: [{ text: userMessage }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
        }
    };

    // Try models in sequence if one fails
    for (const modelName of MODELS) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.status === 429) {
                console.warn(`Model ${modelName} reached rate limit (429). Trying next...`);
                continue; // Try next model
            }

            if (!response.ok) {
                console.error(`API Error (${modelName}):`, data.error?.message || response.statusText);
                continue; // Try next model
            }

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            console.error(`Unexpected Response Format (${modelName}):`, data);
            continue;

        } catch (error) {
            console.error(`Fetch Error (${modelName}):`, error);
            continue;
        }
    }

    return "Tất cả các mô hình AI đều đang bận hoặc quá tải lượt dùng. Bạn hãy thử lại sau ít phút hoặc liên hệ Admin nhé.";
};
