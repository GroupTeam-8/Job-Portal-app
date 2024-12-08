import React, { useState } from "react";
import { Helmet } from "react-helmet";
const mapApiJs ='https://maps.googleapis.com/maps/api/js'

const FeedbackModal = ({ isOpen,onClose,applicantName,emailName,company,jobTitle   }) => {
    const [feedbackType, setFeedbackType] = useState("custom"); // state to toggle feedback type
    const [customFeedback, setCustomFeedback] = useState("");
    const [autoFeedback] = useState("The applicant is a great match for the position, based on skills and experience.");
    const [cvStatus, setCvStatus] = useState(""); // track CV status (Pass or Fail)
    const [interviewTime, setInterviewTime] = useState("");

    const [interviewLocation, setInterviewLocation] = useState("");

    const handleFeedbackChange = (event) => {
        setFeedbackType(event.target.value);
    };
 console.log(jobTitle)
    const handleCustomFeedbackChange = (event) => {
        setCustomFeedback(event.target.value);
    };

    const handleCvStatusChange = (event) => {
        setCvStatus(event.target.value);
    };

    const handleInterviewTimeChange = (event) => {
        setInterviewTime(event.target.value);
    };

    const handleInterviewLocationChange = (event) => {
        setInterviewLocation(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Kiểm tra loại feedback
        let feedbackContent;
        if (feedbackType === "custom") {
            if (!customFeedback.trim()) {
                alert("Please enter custom feedback.");
                return;
            }
            feedbackContent = customFeedback; // Lấy nội dung custom feedback
        } else if (feedbackType === "auto") {
            if (!cvStatus) {
                alert("Please select a CV status before submitting feedback.");
                return;
            }

            if (cvStatus === "fail") {
                feedbackContent = "We regret to inform you that your application did not meet the criteria. Thank you for your interest.";
            } else if (cvStatus === "pass") {
                if (!interviewTime || !interviewLocation.trim()) {
                    alert("Please provide interview time and location.");
                    return;
                }
                feedbackContent = `Congratulations! Your CV in ${jobTitle} has been shortlisted. Please attend the interview scheduled on ${interviewTime} at ${interviewLocation}.`;
            }
        }

        try {
            // Gửi request đến server để gửi email
            const response = await fetch("http://localhost:3001/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    toEmail: emailName,           // Email của ứng viên
                    applicantName: applicantName, // Tên ứng viên
                    feedbackContent: feedbackContent, // Nội dung feedback
                    company: company,
                }),
            });

            if (response.ok) {
                alert("Feedback email sent successfully!");
                onClose(); // Đóng modal sau khi gửi thành công
            } else {
                throw new Error("Failed to send email.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error sending email.");
        }
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <Helmet>
                <style>
                    {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .modal-content {
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        position: relative;
                        width: 600px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    .close-button {
                        background: none;
                        border: none;
                        font-size: 20px;
                        font-weight: bold;
                        color: #555;
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        cursor: pointer;
                    }
                    .button-container {
                        display: flex;
                        justify-content: space-between;
                    }
                    textarea {
                        width: 100%;
                        height: 100px;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        margin-bottom: 10px;
                    }
                    button {
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                    h2 {
                        text-align: center;
                        font-size: 24px;
                        color: red;
                    }
                    label {
                        font-weight: bold;
                        margin-bottom: 5px;
                        color: #333;
                    }
                    .select-feedback, .select-status {
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 15px;
                    }
                    .input-container {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 15px;
                    }
                    .input-container input {
                        width: 48%;
                    }
                    `}
                </style>
            </Helmet>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Feedback Form</h2>
                <p><strong>Applicant Name: </strong> {applicantName}</p>
                <p><strong>Email: </strong>{emailName}</p>

                <form id="feedbackForm" onSubmit={handleSubmit}>
                    <label htmlFor="feedbackType">Choose Feedback Type:</label>
                    <select
                        id="feedbackType"
                        className="select-feedback"
                        value={feedbackType}
                        onChange={handleFeedbackChange}
                    >
                        <option value="custom">Custom Feedback</option>
                        <option value="auto">Auto Feedback</option>
                    </select>

                    {feedbackType === "custom" && (
                        <>
                            <label htmlFor="comments">Enter Custom Feedback:</label>
                            <textarea
                                id="comments"
                                value={customFeedback}
                                onChange={handleCustomFeedbackChange}
                                placeholder="Write additional comments here"
                            />
                        </>
                    )}

                    {feedbackType === "auto" && (
                        <>
                            <label>Auto Generated Feedback:</label>


                            <label htmlFor="cvStatus">CV Status:</label>
                            <select
                                id="cvStatus"
                                className="select-status"
                                value={cvStatus}
                                onChange={handleCvStatusChange}
                            >
                                <option value="">Select Status</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                            </select>

                            {cvStatus === "fail" && (
                                <>


                                </>
                            )}

                            {cvStatus === "pass" && (
                                <div className="input-container">
                                    <div>
                                        <label htmlFor="interviewTime">Interview Time:</label>
                                        <input
                                            type="datetime-local"
                                            id="interviewTime"
                                            value={interviewTime}
                                            onChange={handleInterviewTimeChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="interviewLocation">Interview Location:</label>
                                        <input
                                            type="text"
                                            id="interviewLocation"
                                            value={interviewLocation}
                                            onChange={handleInterviewLocationChange}
                                            placeholder="Enter location"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="button-container">
                        <button type="submit" className="button" >Submit Feedback</button>
                        <button type="button" className="button cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
