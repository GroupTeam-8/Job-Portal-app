import React, { useState } from 'react';
import '../../styles/ApplicationForm.css';
import Helmet from "react-helmet";
import {useNavigate, useLocation, useParams} from 'react-router-dom';
const ApplicationForm = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { jobId } = useParams();
    const locationData = useLocation();
    const job = locationData.state?.job;
    const idjob = jobId
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cv: null,
        coverLetter: '',
        // idjob: job?.id || '',
        idjob: jobId || '',
    });
    // console.log(job.id);
    console.log(jobId);

    const handleInputChange = (e) => {
        const { id, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('coverLetter', formData.coverLetter);
        formDataToSend.append('cv', formData.cv);
        formDataToSend.append('jobId', formData.idjob);
        console.log('Form Data to Send:', formDataToSend);
        try {

            const response = await fetch('http://localhost:3001/api/apply', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                alert('Please fill all the field!')
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data.message);
            alert('Apply success')
            onClose(); // Đóng modal sau khi nộp đơn thành công
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isOpen) return null; // Ẩn modal khi không được mở
    const handleJobClick = () => {
        navigate(`/Job-BoardMain`);
    };
    return (
        <div className="modal-overlay">
            <Helmet>
                <style>{
`
                    /* General Modal Styling */
.modal-content {
     width: 500px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    position: fixed; /* Để modal không bị cuộn */
    top: 50%; /* Căn giữa dọc */
    left: 50%; /* Căn giữa ngang */
    transform: translate(-50%, -50%); /* Dịch modal về đúng tâm */
    animation: fadeIn 0.3s ease-in-out;
    z-index: 1000; /* Đảm bảo modal luôn ở trên các phần tử khác */
}

/* Close Button */
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
    transition: color 0.2s;
}

.close-button:hover {
    color: #d9534f;
}

/* Form Header */
.modal-content h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

/* Form Group Styling */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #007bff;
    outline: none;
}

/* File Input */
.form-group input[type="file"] {
    padding: 5px;
}

/* Button Styling */
.button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.2s;
}

.button.cancel {
    background-color: #d9534f;
    color: white;
}

.button.cancel:hover {
    background-color: #c9302c;
}

.button:not(.cancel) {
    background-color: #007bff;
    color: white;
}

.button:not(.cancel):hover {
    background-color: #0056b3;
}

/* Responsive Design */
@media (max-width: 600px) {
    .modal-content {
        width: 90%;
        padding: 15px;
    }

    .button-container {
        flex-direction: column;
    }

    .button {
        width: 100%;
        margin-bottom: 10px;
    }

    .button:last-child {
        margin-bottom: 0;
    }
}

/* Modal Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}


`
                }</style>
            </Helmet>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Job Application Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cv">Upload CV:</label>
                        <input
                            type="file"
                            id="cv"
                            accept=".pdf"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverLetter">Cover Letter:</label>
                        <textarea
                            id="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleInputChange}
                            placeholder="Write your cover letter"
                        />
                    </div>

                    <div className="button-container">
                        <button className="button" type="submit" >Submit Application</button>
                        <button className="button cancel" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
