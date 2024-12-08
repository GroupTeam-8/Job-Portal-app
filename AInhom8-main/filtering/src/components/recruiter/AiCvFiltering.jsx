import React, { useState, useEffect } from 'react';
import '../../styles/AiCvFiltering.css';
import { useNavigate } from 'react-router-dom';
import Helmet from "react-helmet";
import Sidebar from '../Sidebar';
const AiCvFiltering = () => {
    const [applicants, setApplicants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobTitleFilter, setJobTitleFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('userToken'); // Xóa token khi đăng xuất
        navigate('/login'); // Chuyển hướng về trang đăng nhập
    };
    useEffect(() => {
        fetchApplicants();
    }, []);

    // Lấy danh sách ứng viên từ backend
    const fetchApplicants = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/applicants');
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            const data = await response.json();
            // Chỉ giữ lại các ứng viên có status là 'pending'
            setApplicants(data.filter(applicant => applicant.status === 'pending'));
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    };

    // Bộ lọc các ứng viên theo các tiêu chí tìm kiếm
    const filteredApplicants = applicants.filter(applicant => {
        return (
            (jobTitleFilter === '' || applicant.job_title === jobTitleFilter) &&
            (experienceFilter === '' || applicant.experience.startsWith(experienceFilter)) &&
            (searchTerm === '' || applicant.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Xử lý khi nhấn nút Reject
    const handleReject = async (applicantId) => {
        const confirmReject = window.confirm("Are you sure you want to reject this applicant?");
        if (!confirmReject) return;

        try {
            const response = await fetch(`http://localhost:3001/api/applicants/${applicantId}/reject`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to reject applicant');
            }

            // Cập nhật lại danh sách ứng viên sau khi từ chối
            setApplicants((prevApplicants) => prevApplicants.filter(applicant => applicant.id !== applicantId));
        } catch (error) {
            console.error('Error rejecting applicant:', error);
        }
    };

    const handleShortlistClick = (applicantId) => {
        navigate(`/applicant/${applicantId}`);
    };

    return (
        <div>

        <div className="container">

            <Helmet>
                <style>{`
       /* src/styles/AiCvFiltering.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    justify-content: center;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
}

.search-bar, .filter-bar {
    margin-bottom: 20px;
}

.filter-bar select, .search-bar input {
    padding: 10px;
    width: calc(100% - 20px);
    margin-bottom: 10px;
}

.applicant-list {
    list-style: none;
    padding: 0;
}

.applicant-card {
    padding: 15px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.action-buttons button {
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.action-buttons button:hover {
    background-color: #0056b3;
}

        `}</style>
            </Helmet>

            <h2>Recruiter Dashboard</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Applicants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="filter-bar">
                <select value={jobTitleFilter} onChange={(e) => setJobTitleFilter(e.target.value)}>
                    <option value="">Filter by Job Title</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="NodeJS Developer">NodeJS Developer</option>

                    <option value="Data Analyst">Data Analyst</option>
                </select>
                <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
                    <option value="">Filter by Experience</option>
                    <option value="1">1 Years</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6">6 Years</option>
                    <option value="5+">5+ Years</option>
                </select>
            </div>

            <ul className="applicant-list">
                {filteredApplicants.map(applicant => (
                    <li key={applicant.id} className="applicant-card">
                        <div>
                            <h4>{applicant.name}</h4>
                            <p>Job Title: {applicant.job_title}</p> {/* Hiển thị job_title */}
                            <p>Experience: {applicant.experience}</p>
                        </div>
                        <div className="action-buttons">
                            <button onClick={() => handleShortlistClick(applicant.id)}>Shortlist</button>
                            <button
                                onClick={() => handleReject(applicant.id)}
                                style={{background: 'red', color: 'white', fontWeight: 'bold'}}
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default AiCvFiltering;
