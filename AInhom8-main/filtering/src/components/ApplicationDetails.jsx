// src/components/ApplicationDetails.jsx
import React from 'react';
import '../styles/ApplicationDetails.css';
import Helmet from "react-helmet"; // Create a CSS file if needed

const ApplicationDetails = () => {
    const withdrawApplication = () => {
        // Functionality for withdrawing the application can go here
        console.log('Application withdrawn');
    };

    return (
        <div className="container">
            <Helmet>
                <style>{`
        /* src/styles/ApplicationDetails.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 600px;
    margin: 50px auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.details {
    margin-bottom: 20px;
}

.details h3 {
    margin: 10px 0;
}

.status {
    font-weight: bold;
    margin: 10px 0;
}

.timeline {
    margin: 20px 0;
    padding: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
}

.step {
    margin: 5px 0;
    padding: 5px;
    border-left: 4px solid #007BFF;
    background-color: #f8f9fa;
}

.button {
    padding: 10px 15px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
    text-align: center;
}

.button:hover {
    background-color: #c82333;
}

        `}</style>
            </Helmet>
            <h2>Application Details</h2>

            <div className="details">
                <h3>Job Title: Software Engineer</h3>
                <p><strong>Company:</strong> Innovative Tech Co.</p>
                <p className="status"><strong>Application Status:</strong> Under Review</p>
                <h3>Job Description:</h3>
                <p>This position requires strong software development skills and experience with various programming languages...</p>
            </div>

            <div className="timeline">
                <h3>Application Process Steps:</h3>
                <div className="step">1. Submitted</div>
                <div className="step">2. Under Review</div>
                <div className="step">3. Interview Scheduled</div>
                <div className="step">4. Offer Extended</div>
            </div>

            <button className="button" type="button" onClick={withdrawApplication}>Withdraw Application</button>
        </div>
    );
};

export default ApplicationDetails;
