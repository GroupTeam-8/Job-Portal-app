// src/components/JobSearch.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JobSearch.css';
import axios from 'axios';
import Helmet from "react-helmet";

const JobSearch = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const jobsPerPage = 3;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/job-postings');
                setJobs(response.data);
                console.log('Fetched jobs:', response.data); // Log dữ liệu công việc nhận được
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };
        fetchJobs();
    }, []);

    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    const currentJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
    const filteredJobs = currentJobs.filter(job =>
        job.job_title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const handleJobDetail = (job) => {
        console.log('Navigating to job details with:', job); // Kiểm tra dữ liệu công việc
        navigate('/job-details', { state: { job } });
    };



    return (
        <div className="container">
            <Helmet>
                <style>{`
          /* JobSearch.css */
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
.job-list {
    list-style: none;
    padding: 0;
}
.job-card {
    padding: 15px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
}
.apply-button {
    padding: 10px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.apply-button:hover {
    background-color: #218838;
}

        `}</style>
            </Helmet>
            <h2>Job Search</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Keywords"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>
            <ul className="job-list">
                {filteredJobs.map((job) => (
                    <li key={job.id} className="job-card">
                        <div>
                            <h4>{job.job_title}</h4>
                            <p>Company: {job.experience} | Location: {job.experience} | Salary: {job.salary_range}</p>
                        </div>
                        <button onClick={() => handleJobDetail(job)} className="apply-button">Apply</button>

                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default JobSearch;
