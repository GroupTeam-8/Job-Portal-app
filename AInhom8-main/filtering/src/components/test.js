import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
    // State for chat history and question
    const [chatHistory, setChatHistory] = useState([]);
    const [question, setQuestion] = useState("");

    // State for file upload
    const [cvFile, setCvFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle CV upload
    const handleUploadCV = async () => {
        if (!cvFile) {
            alert("Please select a CV file!");
            return;
        }

        const formData = new FormData();
        formData.append("cv_file", cvFile);

        setIsUploading(true);

        try {
            const response = await axios.post("http://localhost:3001/api/evaluate_cv1", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const botResponse = response.data.evaluation_result || "Unable to analyze CV.";
            setChatHistory([...chatHistory, { role: "bot", content: botResponse }]);
        } catch (error) {
            console.error("Error analyzing CV:", error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle question submission
    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        const updatedChat = [...chatHistory, { role: "user", content: question }];

        try {
            const response = await axios.post(
                "http://localhost:3001/api/job_market_questions",
                { chatHistory: updatedChat },
                { headers: { "Content-Type": "application/json" } }
            );

            const botResponse = response.data.answer || "I don't have an answer.";
            setChatHistory([...updatedChat, { role: "bot", content: botResponse }]);
            setQuestion("");
        } catch (error) {
            console.error("Error in Q&A:", error.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>ChatBot</h2>

            {/* CV Upload Section */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="file"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    accept=".pdf"
                    style={{ marginRight: "10px" }}
                />
                <button onClick={handleUploadCV} disabled={isUploading}>
                    {isUploading ? "Analyzing..." : "Upload CV"}
                </button>
            </div>

            {/* Chat Section */}
            <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto", marginBottom: "20px" }}>
                {chatHistory.map((chat, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <strong>{chat.role === "user" ? "You" : "Bot"}:</strong>
                        <p>{chat.content}</p>
                    </div>
                ))}
            </div>

            {/* Question Input */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    style={{ flex: 1, marginRight: "10px", padding: "10px" }}
                />
                <button onClick={handleAskQuestion}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
