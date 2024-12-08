import React, { useState } from 'react';
import Helmet from 'react-helmet';
import axios from 'axios';

const EvaluationResultsModal = ({ EvaluationResults, email, jobTitle, name, isOpen, onClose, ID }) => {
    const [threshold, setThreshold] = useState(50); // Ngưỡng mặc định là 50%
    const [actionStatus, setActionStatus] = useState({});
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedTime, setSelectedTime] = useState(""); // Thời gian
    const [selectedLocation, setSelectedLocation] = useState(""); // Địa điểm

    const handleActionClick = (index, action) => {
        setActionStatus((prev) => ({ ...prev, [index]: action }));
    };

    const handleAutoSendFeedback = () => {
        // Mở chế độ chọn người ứng tuyển theo kết quả threshold
        const filteredApplicants = EvaluationResults.map((result, index) => {
            const match = result.match(/(\d+)%/); // Lấy số điểm
            const currentScore = match ? parseInt(match[1], 10) : 0;
            const status = currentScore >= threshold ? "pass" : "fail";
            return {
                id: ID[index], // Gán ID từ props
                name: name[index],
                email: email[index],
                score: currentScore,

                status,
                jobTitle: jobTitle[index], // Thêm jobTitle vào đối tượng applicant

            };

        });
        setSelectedApplicants(filteredApplicants);
        console.log(jobTitle)
    };

    const handleSendEmail = async () => {
        if (!selectedTime || !selectedLocation) {
            alert("Please select a time and location for the meeting.");
            return;
        }

        setIsSending(true);
        try {
            const promises = selectedApplicants.map((applicant) => {
                const feedbackContent =
                    applicant.status === "pass"
                        ? `Congratulations! Your application has been accepted. The meeting is scheduled at ${selectedTime} at ${selectedLocation}.`
                        : "We regret to inform you that your application was not successful.";
                const data = {
                    toEmail: applicant.email,
                    applicantName: applicant.name,
                    feedbackContent,
                    jobTitle, // Thay "Your Company Name" bằng jobTitle
                };
                return axios.post("http://localhost:3001/send-email", data);
            });

            await Promise.all(promises);

            selectedApplicants.forEach((applicant) => {
                const newStatus = applicant.status === "pass" ? "accepted" : "rejected";
                axios.post("http://localhost:3001/update-application-status", {
                    id: applicant.id, // Gửi id
                    status: newStatus, // Gửi status
                })
                    .then(response => console.log("Response:", response.data))
                    .catch(error => console.error("Error updating status:", error));
            });

            alert("Emails sent successfully!");
        } catch (error) {
            console.error("Error sending emails:", error);
            alert("Failed to send emails. Please try again.");
        }
        setIsSending(false);
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
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            width: auto;
            max-width: 90%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .threshold-input {
            width: 80px;
            padding: 5px;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 14px;
        }

        .send-email-btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            width: 100%;
        }

        .send-email-btn:hover {
            background-color: #0056b3;
        }

        .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #333;
        }

        .close-button:hover {
            color: #007bff;
        }

        .modal-content h2 {
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
        }

        .modal-content h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table th, table td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }

        table th {
            background-color: #f4f4f4;
        }

        table td {
            background-color: #fff;
        }

        label {
            display: block;
            margin-bottom: 10px;
            font-size: 16px;
        }

        /* Chỉnh sửa các input trường Meeting Time và Meeting Location */
        .input-group {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
        }

        .input-group label {
            font-size: 16px;
            margin-bottom: 5px;
        }

        .input-group input,
        .input-group select {
            padding: 5px;
            font-size: 14px;
            margin-bottom: 10px;
        }

        /* Cải tiến giao diện bảng */
        .input-group .button-wrapper {
            flex: 0 0 auto;
        }

        .input-group button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .input-group button:hover {
            background-color: #0056b3;
        }

        .modal-content .threshold-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 20px;
        }

        .modal-content .threshold-container input {
            width: 80px;
            margin-left: 10px;
        }

        .modal-content .applicant-table {
            margin-top: 20px;
        }

        .modal-content .applicant-table table {
            width: 100%;
        }

        .modal-content .applicant-table th,
        .modal-content .applicant-table td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        `}
                </style>
            </Helmet>


            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Set Threshold for Evaluation</h2>
                <div>
                    <label>
                        Threshold (%):
                        <input
                            type="number"
                            className="threshold-input"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                        />
                    </label>
                    <button className="send-email-btn" onClick={handleAutoSendFeedback}>
                        Select Applicants
                    </button>
                </div>
                {/* Phần nhập liệu thời gian và địa điểm */}
                <div className="input-group">
                    <label>Select Meeting Time:</label>
                    <input
                        type="text"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        placeholder="Enter time"
                    />
                    <label>Select Meeting Location:</label>
                    <input
                        type="text"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        placeholder="Enter location"
                    />
                </div>
                {selectedApplicants.length > 0 && (
                    <div>
                        <h3>Applicants Based on Threshold</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Job Title</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicants.map((applicant, index) => (
                                <tr key={index}>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.score}%</td>
                                    <td>{applicant.status}</td>
                                    <td>{applicant.jobTitle}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {selectedApplicants.some(applicant => applicant.status === "pass") && (
                            <button
                                className="send-email-btn"
                                onClick={handleSendEmail}
                                disabled={isSending}
                            >
                                {isSending ? "Sending Emails..." : "Send Emails"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluationResultsModal;
