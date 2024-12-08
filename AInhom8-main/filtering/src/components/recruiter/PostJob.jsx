import React, { useState } from 'react';
import '../../styles/jobboard.css';
import Helmet from "react-helmet";  // Nhập file CSS chính
import '../../styles/animate.min.css'
import '../../styles/custom-bs.css'
import '../../styles/jquery.fancybox.min.css'
import '../../styles/bootstrap-select.min.css'
import '../../styles/owl.carousel.min.css'
import 'icomoon/style.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Giao diện mặc định của React Quill
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
const PostJob = () => {

    const navigate = useNavigate(); // Initialize useNavigate
    $(document).ready(function() {
        console.log('jQuery is ready!');
    });

    const [jobDetails, setJobDetails] = useState({
        jobTitle: '',
        jobDescription: '',
        requiredSkills: '',
        experience: '',
        salaryRange: '',
        jobLocation: '',
        company: '',
    });

    const [expiryDate, setExpiryDate] = useState('');
    const [jobType, setJobType] = useState('full-time');
    const [postedDate] = useState(new Date().toISOString());

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails({ ...jobDetails, [name]: value });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!selectedFile) {
            alert('Please upload an image!');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('jobTitle', jobDetails.jobTitle);
        formData.append('jobDescription', jobDetails.jobDescription);
        formData.append('requiredSkills', jobDetails.requiredSkills);
        formData.append('experience', jobDetails.experience);
        formData.append('salaryRange', jobDetails.salaryRange);
        formData.append('expiryDate', expiryDate);
        formData.append('jobType', jobType);
        formData.append('postedDate', postedDate);
        formData.append('jobLocation', jobDetails.jobLocation);
        formData.append('company', jobDetails.company);
        try {
            const response = await axios.post('http://localhost:3001/job-postings', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token
                    'Content-Type': 'multipart/form-data', // Required for FormData
                },
            });
            alert('Job posting successful!');
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post the job!');
        }
    };

    const handleJobClick = (jobId) => {
        navigate(`/Job-BoardMain`);
    };
    const handleBothClick = () => {
        handleSubmit();
        handleJobClick();
    };
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    return (
        <div className="site-wrap">
            {/* Mobile Menu */}
            <div className="site-mobile-menu site-navbar-target">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle"></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body"></div>
            </div>

            {/* Navbar */}
            <header className="site-navbar mt-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="site-logo col-6"><a href="/">JobBoard</a></div>
                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="/" className="nav-link active">Home</a></li>
                                <li><a href="/about-page">About</a></li>
                                <li className="has-children">
                                    <a href="/job-listings" className="active">Job Listings</a>
                                    <ul className="dropdown">
                                        <li><a href="/job-single">Job Single</a></li>
                                        <li><a href="/post-job" className="active">Post a Job</a></li>
                                    </ul>
                                </li>
                                <li><a href="/blog">Blog</a></li>
                                <li><a href="/contact-us">Contact</a></li>
                            </ul>
                        </nav>
                        <div className="right-cta-menu text-right d-flex aligin-items-center col-6">
                            <div className="ml-auto">
                                <a href="/post-job" className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-add"></span>Post a Job</a>
                                {/*<a href="/login" className="btn btn-primary border-width-2 d-none d-lg-inline-block"><span className="mr-2 icon-lock_outline"></span>Log In</a>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="section-hero overlay inner-page bg-image"
                style={{backgroundImage: `url(${require('../../images/hero_1.jpg')})`}}
                id="home-section"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Post A Job</h1>
                            <div className="custom-breadcrumbs">
                                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                                <a href="#">Job</a> <span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>Post a Job</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Posting Form */}
            <section className="site-section">
                <div className="container">
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-8 mb-4 mb-lg-0">
                            <div className="d-flex align-items-center">
                                <h2>Post A Job</h2>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-6">
                                    <button onClick={handleSubmit} className="btn btn-block btn-primary btn-md">Save Job</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="p-4 p-md-5 border rounded" method="post">
                        <h3 className="text-black mb-5 border-bottom pb-2">Job Details</h3>


                        {/* Job Title Field */}
                        <div className="form-group">

                            <label htmlFor="job-image">Upload Featured Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="job-image"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e)}
                            />
                            <label>Job Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="jobTitle"
                                value={jobDetails.jobTitle}
                                onChange={handleChange}
                                placeholder="Product Designer"
                            />
                        </div>
                        <div className="form-group">
                            <label>Job Description</label>
                            <ReactQuill
                                theme="snow"
                                value={jobDetails.jobDescription} // Giá trị hiện tại từ state
                                onChange={(content) => setJobDetails({
                                    ...jobDetails,
                                    jobDescription: content
                                })} // Cập nhật giá trị khi nội dung thay đổi
                                placeholder="Write the job description here..." // Placeholder
                            />
                        </div>
                        <div className="form-group">
                            <label>Requirement Skills</label>
                            <ReactQuill
                                theme="snow"
                                value={jobDetails.requiredSkills} // Giá trị hiện tại từ state
                                onChange={(content) => setJobDetails({
                                    ...jobDetails,
                                    requiredSkills: content
                                })} // Cập nhật giá trị khi nội dung thay đổi
                                placeholder="Write the job requirement here..." // Placeholder
                            />

                        </div>


                        <div className="form-group">
                            <label>Experience</label>
                            <input
                                type="text"
                                className="form-control"
                                name="experience"
                                value={jobDetails.experience}
                                onChange={handleChange}
                                placeholder="Experience year"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="jobLocation"
                                value={jobDetails.jobLocation}
                                onChange={handleChange}
                                placeholder="e.g. New York"
                            />
                        </div>
                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                className="form-control"
                                name="company"
                                value={jobDetails.company}
                                onChange={handleChange}
                                placeholder="Google, facebook..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Salary range</label>
                            <input
                                type="text"
                                className="form-control"
                                name="salaryRange"
                                value={jobDetails.salaryRange}
                                onChange={handleChange}
                                placeholder="Salary range"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiry-date">Expiry Date:</label>
                            <input
                                type="date"
                                id="expiry-date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Job Type Field */}
                        <div className="form-group">
                            <label>Job Type : </label>
                            <select
                                name="jobType"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                data-style="btn-black"
                                data-width="100%"
                                data-live-search="true"
                                title="Select Job Type"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>

                    </form>

                    {/* Buttons */}
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-4 ml-auto">
                            <div className="d-flex justify-content-between">
                                <button onClick={handleBothClick} className="btn btn-block btn-primary btn-md">Save Job
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PostJob;
