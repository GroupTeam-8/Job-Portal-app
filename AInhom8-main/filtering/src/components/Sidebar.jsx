// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from "react-helmet";
import '../styles/sidebar.css';
const Sidebar = ({ onSignOut }) => {
    return (

        <div className="sidebar">

            <h2>Applicant</h2>
            <Link to="/job-search" className="sidebar-link">
                <i className="fas fa-search icon"></i>
                <span className="link-text">Job Search</span>
            </Link>
            <Link to="/candidate-profile" className="sidebar-link">
                <i className="fas fa-user icon"></i>
                <span className="link-text">Candidate Profile</span>
            </Link>
            <Link to="/application-status" className="sidebar-link">
                <i className="fas fa-file-alt icon"></i>
                <span className="link-text">Application Status</span>
            </Link>
            <Link to="/security-settings" className="sidebar-link">
                <i className="fas fa-shield-alt icon"></i>
                <span className="link-text">Security Settings</span>
            </Link>
            <Link to="/privacy-settings" className="sidebar-link">
                <i className="fas fa-cog icon"></i>
                <span className="link-text">Privacy Settings</span>
            </Link>

            {/* Nút đăng xuất */}
            <button onClick={onSignOut} className="sidebar-link sign-out-btn">
                <i className="fas fa-sign-out-alt icon"></i>
                <span className="link-text">Sign Out</span>
            </button>
        </div>
    );
};

export default Sidebar;
