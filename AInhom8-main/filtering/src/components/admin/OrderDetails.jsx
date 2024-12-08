import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderDetails() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Fetch job postings from the server
        axios.get('http://localhost:3001/job_postings') // Đảm bảo đúng URL server của bạn
            .then(response => {
                setJobs(response.data);
                console.log(setJobs)
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu job postings:', error);
            });
    }, []);

    return (
        <div className="recentOrders">
            <div className="cardHeader">
                <h2>Job</h2>
                <a href="/job" className="btn">View All</a>
            </div>
            <table>
                <thead>
                <tr>
                    <td>Job Title</td>
                    <td>Company</td>
                    <td>Location</td>
                    <td>Salary</td>
                </tr>
                </thead>
                <tbody>
                {jobs.map((job, index) => (
                    <tr key={index}>
                        <td>{job.job_title}</td>
                        <td>{job.company}</td>
                        <td>{job.location}</td>
                        <td>{job.salary_range}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderDetails;
