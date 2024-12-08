// src/components/ApplicationStatus.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/ApplicationStatus.css';
import Helmet from "react-helmet"; // Create a CSS file if needed

const ApplicationStatus = () => {
    const navigate = useNavigate(); // Replaces useHistory

    const applicationDetail = () => {
        navigate('/application-details'); // Programmatic navigation
    };

    return (
        <div>
            <Helmet>
                <style>
                    {
                        `
                        /* src/styles/ApplicationStatus.css */
.application-status-container {
    max-width: 600px;
    margin: 50px auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.application-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #fafafa;
}

.application-card h3 {
    margin: 0 0 5px;
}

.application-card p {
    margin: 5px 0;
}

.button {
    padding: 8px 15px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.button:hover {
    background-color: #0056b3;
}

                        `
                    }
                </style>
            </Helmet>
            <h2>Application Status</h2>
            <div className="application-card">
                <h3>Job Title: Software Developer</h3>
                <p><strong>Company:</strong> Tech Solutions Inc.</p>
                <p><strong>Status:</strong> Under Review</p>
                {/* Call applicationDetail function on button click */}
                <button onClick={applicationDetail} className="button" type="button">View Details</button>
            </div>

            <div className="application-card">
                <h3>Job Title: Project Manager</h3>
                <p><strong>Company:</strong> Business Corp</p>
                <p><strong>Status:</strong> Interview</p>
                <button onClick={applicationDetail} className="button" type="button">View Details</button>
            </div>

            <div className="application-card">
                <h3>Job Title: Data Analyst</h3>
                <p><strong>Company:</strong> Data Insights LLC</p>
                <p><strong>Status:</strong> Rejected</p>
                <button onClick={applicationDetail} className="button" type="button">View Details</button>
            </div>
        </div>
    );
};

export default ApplicationStatus;