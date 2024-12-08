// src/components/RecruiterHome.jsx
import React,{useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import '../styles/RecruiterHome.css';
import Helmet from "react-helmet";
const RecruiterHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userToken = sessionStorage.getItem('userToken');
        if (!userToken) {
            // Nếu không có token, điều hướng về trang đăng nhập
            navigate('/', { replace: true }); // replace: true để không lưu lại lịch sử
        }
    }, [navigate]);

    const handleSignOut = () => {
        // Xóa token khỏi sessionStorage
        sessionStorage.removeItem('userToken');

        // Điều hướng về trang login và thay thế lịch sử trang
        navigate('/', { replace: true });
    };
    return (
        <div className="recruiter-home">
            <Helmet>
                <style>
                    {
                        `
                        /* src/styles/RecruiterHome.css */
/* src/styles/RecruiterHome.css */

.sidebar-link.sign-out-button {
    display: flex;
    align-items: center;
    padding: 30px;
    margin-top: 297px ;
    color: white;
    text-decoration: none;
    background: none; /* Không có nền mặc định */
    border: none; /* Không có đường viền */
    cursor: pointer; /* Con trỏ chuột chuyển sang dạng pointer khi hover */
    transition: padding-left 0.3s ease;
    white-space: nowrap;
}

.sidebar-link.sign-out-button .icon {
    font-size: 17px;
    margin-right: 10px;
}

.sidebar-link.sign-out-button .link-text {
    display: none; /* Ẩn văn bản mặc định */
    font-size: 12px;
}

.sidebar:hover .sidebar-link.sign-out-button .link-text {
    display: inline-block; /* Hiển thị văn bản khi hover */
}

.sidebar-link.sign-out-button:hover {
    background-color: #444; /* Màu nền khi hover */
}

.recruiter-home {
    display: flex;
}

.sidebar {
    width: 87px; /* Initial width to show only icons */
    height: 100vh; /* Full height sidebar */
    background-color: #333;
    transition: width 0.3s ease; /* Smooth transition for expanding */
    color: white;
    padding-top: 20px;
    overflow: hidden; /* Hide any overflow content initially */
}

.sidebar:hover {
    width: 200px; /* Expanded width when hovered */
}

.sidebar h2 {
    color: white;
    text-align: center;
    padding: 10px 0;
    font-size: 18px;
    visibility: hidden; /* Hide the heading */
}

.sidebar:hover h2 {
    visibility: visible; /* Show the heading when sidebar is hovered */
}

.sidebar-link {
    display: flex;
    align-items: center;
    padding: 15px;
    padding-left:23px;
    color: white;
    text-decoration: none;
    transition: padding-left 0.3s ease;
    white-space: nowrap; /* Prevent text from breaking into new lines */
}

.sidebar-link .icon {
    font-size: 17px;
    margin-right: 10px;
}

.sidebar-link .link-text {
    display: none; /* Hide the text by default */
    font-size: 10px;
}

.sidebar:hover .sidebar-link .link-text {
    display: inline-block; /* Show the text when sidebar is hovered */
}

.sidebar-link:hover {
    background-color: #444; /* Change background color on hover */
}

.content {
    margin-left: 80px; /* Space for the initial sidebar width */
    padding: 20px;
    flex-grow: 1; /* Fill remaining space */
}

.content h1 {
    font-size: 24px;
}

.content p {
    font-size: 18px;
}

                        `
                    }
                </style>
            </Helmet>
            {/* Sidebar for Recruiter */}
            <div className="sidebar">
                <h2>Recruiter</h2>
                <Link to="/job-postings" className="sidebar-link">
                    <i className="fas fa-list-alt icon"></i>
                    <span className="link-text">Job Posting Management</span>
                </Link>
                <Link to="/ai-cv-filtering" className="sidebar-link">
                    <i className="fas fa-search icon"></i>
                    <span className="link-text">AI CV Filtering</span>
                </Link>
                <Link to="/candidate-search" className="sidebar-link">
                    <i className="fas fa-users icon"></i>
                    <span className="link-text">Candidate Search</span>
                </Link>
                <Link to="/security-settings" className="sidebar-link">
                    <i className="fas fa-shield-alt icon"></i>
                    <span className="link-text">Security Settings</span>
                </Link>
                <Link to="/cv-Evaluation" className="sidebar-link">
                    <i className="fas fa-cog icon"></i>
                    <span className="link-text">Privacy Settings</span>
                </Link>

                {/* Sign Out Button */}
                <button onClick={handleSignOut} className="sidebar-link sign-out-button">
                    <i className="fas fa-sign-out-alt icon"></i>
                    <span className="link-text">Sign Out</span>
                </button>

            </div>

            {/* Main Content for Recruiter */}
            <div className="content">
                <h1>Welcome to the Recruiter Dashboard</h1>
                <p>
                Manage your job postings, filter applicants with AI, and track application statuses. Use the sidebar to navigate through your options and adjust your security and privacy settings.
                </p>
            </div>
        </div>
    );
};

export default RecruiterHome;
