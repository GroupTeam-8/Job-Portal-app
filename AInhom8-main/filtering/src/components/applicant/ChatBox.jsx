import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../styles/Chatbox.css";
import Helmet from "react-helmet";

const Chatbox = () => {
    const [cvFile, setCvFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState("");
    const chatEndRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const toggleChatVisibility = () => {
        setIsChatVisible(!isChatVisible);
    };

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

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const updatedChat = [...chatHistory, { role: "user", content: message }];
        setChatHistory(updatedChat);
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:3001/api/job_market_questions",
                { chatHistory: updatedChat },
                { headers: { "Content-Type": "application/json" } }
            );

            const botResponse = response.data.answer || "No response.";
            setChatHistory([...updatedChat, { role: "bot", content: botResponse }]);
        } catch (error) {
            console.error("Error:", error);
            setChatHistory([...updatedChat, { role: "bot", content: "An error occurred." }]);
        }
    };
    const handleRemoveFile = () => {
        setCvFile(null); // Xóa tệp đã chọn
    };
    const parseEvaluationResult = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={index}>
                        {parts.map((part, idx) =>
                            idx % 2 === 1 ? <span key={idx} className="highlight">{part}</span> : part
                        )}
                    </p>
                );
            }
            return <p key={index}>{line}</p>;

        });
    };
    return (
        <div className="chat-container">
            {/* Chat Toggle Button */}
            {!isChatVisible && (
                <button
                    style={{
                        backgroundColor: "#82ccdd",
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: "1000",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "25px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    onClick={toggleChatVisibility}
                >
                    💬
                </button>
            )}

            {isChatVisible && (
                <div className="container-fluid h-100 chat-box">
                    <Helmet>
                        <style>
                            {`
                                .chat-container {
                                    position: fixed;
                                    bottom: 20px;
                                    right: 20px;
                                    z-index: 1000;
                                }

                                .chat {
                                    margin: auto;
                                }

                                .card {
                                    height: 500px;
                                    width: 515px;
                                    max-width: 170%;
                                    border-radius: 15px !important;
                                    background-color: rgba(0, 0, 0, 0.4) !important;
                                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                                }

                                .card-header {
                                    border-radius: 15px 15px 0 0 !important;
                                    border-bottom: 0 !important;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    color: white;
                                    text-align: center;
                                    padding: 10px;
                                    font-weight: bold;
                                    position: relative;
                                }

                                /* Close Button */
                                .close-btn {
                                    position: absolute;
                                    right: 10px;
                                    top: 10px;
                                    font-size: 20px;
                                    color: white;
                                    background: none;
                                    border: none;
                                    cursor: pointer;
                                }

                                .card-footer {
                                    border-radius: 0 0 15px 15px !important;
                                    border-top: 0 !important;
                                    background-color: rgba(0, 0, 0, 0.5);
                                }

                                .msg_card_body {
                                    overflow-y: auto;
                                    max-height: 380px;
                                    padding: 10px;
                                }

                                .type_msg {
                                    background-color: rgba(0, 0, 0, 0.3) !important;
                                    border: 0 !important;
                                    color: white !important;
                                    height: 60px !important;
                                    overflow-y: auto;
                                    border-radius: 10px;
                                    padding: 10px;
                                }

                                .type_msg:focus {
                                    box-shadow: none !important;
                                    outline: 0px !important;
                                }

                                .msg_cotainer {
                                    margin-top: auto;
                                    margin-bottom: auto;
                                    margin-left: 10px;
                                    border-radius: 25px;
                                    background-color: #82ccdd;
                                    padding: 10px;
                                    position: relative;
                                    max-width: 70%;
                                    word-wrap: break-word;
                                }

                                .msg_cotainer_send {
                                    margin-top: auto;
                                    margin-bottom: auto;
                                    margin-right: 10px;
                                    border-radius: 25px;
                                    background-color: #78e08f;
                                    padding: 10px;
                                    position: relative;
                                    max-width: 70%;
                                    word-wrap: break-word;
                                }

                                .msg_time {
                                    position: absolute;
                                    left: 10px;
                                    bottom: -15px;
                                    color: rgba(255, 255, 255, 0.5);
                                    font-size: 10px;
                                }

                                .msg_time_send {
                                    position: absolute;
                                    right: 10px;
                                    bottom: -15px;
                                    color: rgba(255, 255, 255, 0.5);
                                    font-size: 10px;
                                }

                                .img_cont {
                                    position: relative;
                                    height: 50px;
                                    width: 50px;
                                }

                                .user_img {
                                    height: 50px;
                                    width: 50px;
                                    border: 2px solid white;
                                    border-radius: 50%;
                                }

                                .online_icon {
                                    position: absolute;
                                    height: 15px;
                                    width: 15px;
                                    background-color: #4cd137;
                                    border-radius: 50%;
                                    bottom: 0;
                                    right: 0;
                                    border: 1.5px solid white;
                                }
                            `}
                        </style>
                    </Helmet>
                    <div className="row justify-content-center h-100">
                        <div className="col-md-8 col-xl-6 chat">
                            <div className="card">
                                <div className="card-header msg_head">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img
                                                style={{maxWidth: "45px"}}
                                                src={require('../../images/robot.png')}
                                                className="rounded-circle user_img"
                                                alt="Bot"
                                            />
                                            <span className="online_icon"></span>
                                        </div>
                                        <div style={{paddingTop:"15px",paddingLeft:"15px"}} className="user_info">
                                            <span>Chat with JobMate</span>
                                        </div>
                                        {/* Close Button */}
                                        <button className="close-btn" onClick={toggleChatVisibility}>✖</button>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body">
                                    {chatHistory.map((chat, index) => (
                                        <div
                                            key={index}
                                            className={`d-flex mb-4 ${chat.role === "user" ? "justify-content-end" : "justify-content-start"}`}
                                        >
                                            {chat.role === "bot" && (
                                                <div className="img_cont_msg">
                                                    <img
                                                        style={{maxWidth: "45px"}}
                                                        src={require('../../images/robot.png')}
                                                        className="rounded-circle user_img_msg"
                                                        alt="Bot"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={chat.role === "user" ? "msg_cotainer_send" : "msg_cotainer"}>
                                                {chat.role === "bot" ? parseEvaluationResult(chat.content) : chat.content}
                                                <span
                                                    className={chat.role === "user" ? "msg_time_send" : "msg_time"}>{new Date().toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef}/>
                                </div>
                                <div className="card-footer">
                                    <div className="upload-section">
                                    <div className="d-flex align-items-center mb-2">
                                            {/* Chọn tệp bằng icon ghim */}
                                            {!cvFile ? (
                                                <label
                                                    htmlFor="cv-upload"
                                                    className="cv-upload-icon"
                                                    style={{
                                                        cursor: "pointer",
                                                        marginRight: "10px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <i className="fas fa-paperclip" style={{
                                                        paddingTop:"10px",
                                                        fontSize: "24px",
                                                        color: "#82ccdd"
                                                    }}></i> {/* Icon ghim */}
                                                </label>
                                            ) : (
                                                // Hiển thị tên file đã chọn kèm nút xóa
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginRight: "10px"
                                                }}>
                                                    <span style={{
                                                        color: "#82ccdd",
                                                        marginRight: "5px"
                                                    }}>{cvFile.name}</span>
                                                    <button
                                                        onClick={handleRemoveFile}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            color: "#ff6b6b"
                                                        }}
                                                    >
                                                        <i className="fas fa-times-circle"
                                                           style={{fontSize: "16px"}}></i>
                                                    </button>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                id="cv-upload"
                                                accept=".pdf,.docx"
                                                onChange={(e) => setCvFile(e.target.files[0])}
                                                className="form-control d-none"
                                            />

                                            {/* Upload CV */}
                                            <button
                                                onClick={handleUploadCV}
                                                disabled={isUploading}
                                                className="btn btn-success"
                                                style={{padding: "0 15px"}}
                                            >
                                                {isUploading ? "Evaluate..." : "Evaluate CV"}
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-between">
            <textarea
                type="text"
                className="form-control type_msg"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
            />
                                            <button
                                                className="btn btn-outline-primary"
                                                style={{
                                                    backgroundColor: "#82ccdd",
                                                    borderRadius: "10px",
                                                    marginLeft: "10px",
                                                }}
                                                onClick={handleSendMessage}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
