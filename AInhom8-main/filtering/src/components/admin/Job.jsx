import React, { useEffect, useState } from 'react';
import Navigation from './Navigation'; // Import Navigation component
import TopBar from './TopBar';         // Import TopBar component
import axios from 'axios';

const Job = () => {
    const [jobPostings, setJobPostings] = useState([]);

    useEffect(() => {
        // Fetch job postings from the server
        axios.get('http://localhost:3001/job_postings') // Đảm bảo đúng URL server của bạn
            .then(response => {
                setJobPostings(response.data);
                console.log(setJobPostings)
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu job postings:', error);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/job_postings/${id}`)
            .then(response => {
                alert(response.data.message);
                setJobPostings(jobPostings.filter(job => job.id !== id));
            })
            .catch(error => {
                console.error('Error deleting job posting:', error);
                alert('Failed to delete job posting.');
            });
    };

    const handleEdit = (job) => {
        const newJobTitle = prompt('Enter new job title:', job.job_title);
        const newJobDescription = prompt('Enter new job description:', job.job_description);
        const newRequiredSkills = prompt('Enter new required skills:', job.required_skills);
        const newExperience = prompt('Enter new experience level:', job.experience);
        const newSalaryRange = prompt('Enter new salary range:', job.salary_range);
        const newLocation = prompt('Enter new location:', job.location);
        const newJobType = prompt('Enter new job type:', job.job_type);

        if (newJobTitle && newJobDescription && newRequiredSkills && newExperience && newSalaryRange && newLocation && newJobType) {
            axios.put(`http://localhost:3001/job_postings/${job.id}`, {
                job_title: newJobTitle,
                job_description: newJobDescription,
                required_skills: newRequiredSkills,
                experience: newExperience,
                salary_range: newSalaryRange,
                location: newLocation,
                job_type: newJobType
            })
                .then(response => {
                    alert(response.data.message);
                    setJobPostings(jobPostings.map(j => j.id === job.id ? { ...j, job_title: newJobTitle, job_description: newJobDescription, required_skills: newRequiredSkills, experience: newExperience, salary_range: newSalaryRange, location: newLocation, job_type: newJobType } : j));
                })
                .catch(error => {
                    console.error('Error updating job posting:', error);
                    alert('Failed to update job posting.');
                });
        }
    };

    return (
        <div>
            {/* Navigation Section */}
            <Navigation />

            {/* Main Content */}
            <div className="main">
                {/* TopBar Section */}


                {/* Job Postings Section */}
                <div style={{justifyContent:"center",alignItems:"center",display:"flex"}} className="details">
                    <div className="recentOrders">
                        <div className="cardHeader">
                            <h2>Job Postings</h2>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <td>Image</td>
                                <td>Job Title</td>
                                <td>Job Description</td>
                                <td>Required Skills</td>
                                <td>Experience</td>
                                <td>Salary Range</td>
                                <td>Location</td>
                                <td>Job Type</td>

                                <td>Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {jobPostings.map((job, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={`http://localhost:3001${job.image_url}`}
                                            alt={job.job_title}
                                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                        />
                                    </td>
                                    <td>{job.job_title}</td>
                                    <td style={{fontSize:"12px"}}>{job.job_description}</td>
                                    <td style={{fontSize:"12px"}}>{job.required_skills}</td>
                                    <td>{job.experience}</td>
                                    <td>{job.salary_range}</td>
                                    <td>{job.location}</td>
                                    <td>{job.job_type}</td>

                                    <td>
                                        <button onClick={() => handleEdit(job)}
                                                className="btn btn-success btn-sm rounded-0" type="button"
                                                data-toggle="tooltip" data-placement="top" title="Edit">
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(job.id)}
                                                className="btn btn-danger btn-sm rounded-0" type="button"
                                                data-toggle="tooltip" data-placement="top" title="Delete">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Job;
