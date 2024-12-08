import React, { useState } from "react";
import axios from "axios";

const CVChatBot = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [question, setQuestion] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Xử lý tải lên CV
    const handleUploadCV = async () => {
        if (!cvFile) {
            alert("Vui lòng chọn file CV!");
            return;
        }

        const formData = new FormData();
        formData.append("cv_file", cvFile);

        setIsUploading(true);

        try {
            const response = await axios.post("http://localhost:3001/api/evaluate_cv1", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const botResponse = response.data.evaluation_result || "Không thể phân tích CV.";
            setChatHistory([...chatHistory, { role: "bot", content: botResponse }]);
        } catch (error) {
            console.error("Lỗi khi phân tích CV:", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Xử lý hỏi đáp
    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        const updatedChat = [...chatHistory, { role: "user", content: question }];

        try {
            const response = await axios.post(
                "http://localhost:3001/api/job_market_questions",
                { chatHistory: updatedChat },
                { headers: { "Content-Type": "application/json" } }
            );

            const botResponse = response.data.answer || "Tôi không có câu trả lời.";
            setChatHistory([...updatedChat, { role: "bot", content: botResponse }]);
            setQuestion("");
        } catch (error) {
            console.error("Lỗi khi hỏi đáp:", error.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h2>CV Chatbot</h2>

            {/* Khu vực tải CV */}
            <div>
                <input
                    type="file"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    accept=".pdf"
                />
                <button onClick={handleUploadCV} disabled={isUploading}>
                    {isUploading ? "Đang phân tích..." : "Tải CV lên"}
                </button>
            </div>

            {/* Khu vực chat */}
            <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px", height: "400px", overflowY: "auto" }}>
                {chatHistory.map((chat, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <strong>{chat.role === "user" ? "Bạn" : "Bot"}:</strong>
                        <p>{chat.content}</p>
                    </div>
                ))}
            </div>

            {/* Input gửi câu hỏi */}
            <div>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    style={{ width: "80%" }}
                />
                <button onClick={handleAskQuestion}>Gửi</button>
            </div>
        </div>
    );
};

export default CVChatBot;
