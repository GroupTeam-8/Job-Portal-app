import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/JobDetails.css';
import Helmet from "react-helmet";

const JobDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Kiểm tra dữ liệu công việc từ location state
    const job = location.state?.job;

    // Log để kiểm tra nội dung của location.state
    console.log('Location state:', location.state);

    // Chức năng điều hướng đến trang đơn đăng ký
    const handleApplicationForm = () => {
        navigate('/application-form', { state: { job } });
    };

    // Hàm xử lý khi nhấn vào nút "Shortlist"
    const handleShortlist = async () => {
        if (!job) return;

        const cvData = {
            // Dữ liệu hồ sơ CV mà bạn muốn gửi đi để đánh giá
            jobTitle: job.job_title,
            companyName: job.company,
            // Thêm các trường khác nếu cần thiết
        };

        const apiKey = 'AIzaSyDujl7jCTfhCT1Apwb9UJdIR8uSdyGCRQw'; // Thay thế với API key của bạn
        const apiUrl = 'https://api.gemini.com/evaluate'; // Thay thế với URL của Gemini API

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(cvData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('AI Evaluation Result:', data);
            // Xử lý dữ liệu đánh giá và hiển thị nó trên giao diện người dùng

        } catch (error) {
            console.error('Error evaluating CV:', error);
        }
    };

    // Kiểm tra nếu không có dữ liệu công việc
    if (!job) {
        return <div>Job details not available.</div>;
    }

    return (
        <div className="container">
            <Helmet>
                <style>{`
          /* JobDetails.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    justify-content: center;
}
.container {
    width: 100%;
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h2 {
    text-align: center;
    margin-bottom: 20px;
}
.job-info {
    margin-bottom: 20px;
}
.job-info p {
    font-size: 16px;
    margin: 10px 0;
}
.job-info textarea {
    width: calc(100% - 20px);
    padding: 10px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
    resize: none;
}
.buttons {
    text-align: center;
    margin-top: 20px;
}
.button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
}
.button:hover {
    background-color: #0056b3;
}
.button.save {
    background-color: #28a745;
}
.button.save:hover {
    background-color: #218838;
}

        `}</style>
            </Helmet>
            <h2>Job Details</h2>
            <div className="job-info">
                <p><strong>Job Title:</strong> {job.job_title}</p>
                <p><strong>Company Name:</strong> {job.company}</p>
                <p><strong>Job Description:</strong></p>
                <p>{job.job_description}</p>
                <p><strong>Required Skills:</strong>  {job.required_skills}</p>
                <p><strong>Experience Required:</strong> {job.experience} years</p>
                <p><strong>Salary Range:</strong> {job.salary_range}</p>
                <p><strong>Expiry Date:</strong> {job.expiry_date}</p>
                <p><strong>Job Type:</strong> {job.job_type}</p>
                <p><strong>Posted Date:</strong> {job.posted_date}</p>
                <p><strong>Recruiter ID:</strong> {job.recruiter_id}</p>
            </div>

            <div className="buttons">
                <button onClick={handleApplicationForm} className="button apply-now">Apply Now</button>
                <button onClick={handleShortlist} className="button shortlist">Shortlist</button>
                <button className="button save">Save Job</button>
            </div>
        </div>
    );
};

export default JobDetails;
