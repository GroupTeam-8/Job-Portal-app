import ApplicationForm from './applicant/ApplicationForm';
import React, { useState, useEffect } from "react";

import '../styles/jobboard.css';
import Helmet from "react-helmet";  // Nhập file CSS chính
import '../styles/animate.min.css'
import '../styles/custom-bs.css'
import '../styles/jquery.fancybox.min.css'
import axios from 'axios';
import '../styles/bootstrap-select.min.css'
import '../styles/owl.carousel.min.css'
import 'icomoon/style.css';
import jobLogo from '../images/job_logo_1.jpg';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import $ from 'jquery';
import {Link} from "react-router-dom";
import { useParams,useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import { format } from 'date-fns';
function JobSingle()
{
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                console.log("Job ID:", jobId);
                const response = await fetch(`http://localhost:3001/job-postings/${jobId}`);
                console.log("Response Status:", response.status); // In mã trạng thái HTTP
                if (!response.ok) throw new Error('Error fetching job details');
                const data = await response.json();
                console.log("Fetched Job Details:", data); // In dữ liệu ra console
                setJobDetails(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJobDetails();
    }, [jobId]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Lấy token từ localStorage hoặc context (nếu có)
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/current', {
                    headers: {
                        Authorization: token // Đính kèm token vào header
                    }
                });

                setUser(response.data); // Lưu thông tin người dùng vào state
                console.log(response.data);
                console.log(user)
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Lỗi kết nối');
            }
        };
        fetchUserData();
    }, []); //

    console.log(user)
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/job_postings/${jobId}`);
            if (response.status === 200) {
                alert('Job deleted successfully!');
                navigate('/Job-BoardMain'); // Redirect to Job-BoardMain
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job!');
        }
    };

    return (
        <div>
            {/* Navbar */}
            {/* NAVBAR */}
            <header className="site-navbar mt-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="site-logo col-6">
                            <a href={user?.userType == 'user' ? '/ApplicantHome' : '/Job-BoardMain'}>JobBoard</a>
                        </div>

                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="/Job-BoardMain" className="nav-link active">Home</a></li>
                                <li><a href="/about-page">About</a></li>
                                <li className="has-children">
                                    {user?.userType !== 'user' && (
                                        <a href="/Post-Job">Post job</a>
                                    )}
                                </li>
                                {user?.userType !== 'user' && (
                                    <Link to="/list-job">
                                        <span>AI Filtering</span>
                                    </Link>
                                )}
                                <li><a href="/contact-us">Contact</a></li>
                            </ul>
                        </nav>

                        <div className="right-cta-menu text-right d-flex align-items-center col-6">
                            <div className="ml-auto">
                                {user?.userType !== 'user' && (
                                    <Link
                                        to="/Post-Job"
                                        className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
                                    >
                                        <span className="mr-2 icon-add">Post a Job</span>
                                    </Link>
                                )}
                                <Link
                                    to="/Job-Board"
                                    className="btn btn-primary border-width-2 d-none d-lg-inline-block"
                                >
                                    <span className="mr-2 icon-lock_outline">Logout</span>
                                </Link>
                            </div>
                            <a
                                href="#"
                                className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"
                            >
                                <span className="icon-menu h3 m-0 p-0 mt-2"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="section-hero overlay inner-page bg-image"
                     style={{backgroundImage: "url('images/hero_1.jpg')"}} id="home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Product Designer</h1>
                            <div className="custom-breadcrumbs">
                                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                                <a href="#">Job</a> <span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>Product Designer</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Details */}
            <section className="site-section">
                <div className="container">
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-8 mb-4 mb-lg-0">
                            <div className="d-flex align-items-center">
                                <div  className="p-2 d-inline-block mr-3 rounded">
                                    <img style={{maxWidth:'200px', maxHeight:'200px',borderRadius:'8px'}}  src={`http://localhost:3001${jobDetails?.image_url}`} alt="Image"/>
                                </div>
                                <div>

                                    <h2>{jobDetails?.job_title}</h2>

                                    <div>
                                    <span className="ml-0 mr-2 mb-2">
                                    </span>
                                        <span className="m-2">
                                        <span
                                            className="fa-solid fa-location-dot"> </span>{'       Location:    ' + jobDetails?.location || 'Location not specified'}

                                    </span>
                                        <span className="m-2">
                                        <span className="fa-solid fa-business-time">:  &nbsp; </span>
                                        <span className="text-primary">{jobDetails?.job_type}</span>
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-6">
                                    {/* {user.userType === ''
                                    ? <button onClick={openModal} className="btn btn-block btn-primary btn-md">Apply for Job
                                        </button>
                                    :<button onClick={openModal} className="btn btn-block btn-primary btn-md">Edit Job
                                        </button>
                                } */}
                                    {user ? (
                                        user.userType === 'user'
                                            ? <button onClick={openModal} className="btn btn-block btn-primary btn-md"> Apply for Job
                                            </button>
                                            : <button  onClick={handleDelete} style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "12px 24px",
                                                fontSize: "16px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                transition: "all 0.3s ease",
                                                width: "100%",  // To make the button take full width
                                            }}
                                                       className="btn btn-block btn-primary btn-md"
                                                       onMouseEnter={(e) => e.target.style.backgroundColor = "darkred"}  // Darken on hover
                                                       onMouseLeave={(e) => e.target.style.backgroundColor = "red"}  // Reset on leave
                                                     > Delete
                                            </button>

                                    ) : (
                                        <p className='display none'></p>
                                        )}
                                {/*     <button onClick={openModal} className="btn btn-block btn-primary btn-md">Edit Job*/}
                                {/*</button> */}
                                    <ApplicationForm isOpen={isModalOpen} onClose={closeModal}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            {/* Job Description */}
                            <div className="mb-5">
                                <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                                    <span className="icon-align-left mr-3"></span>Job Description
                                </h3>
                                {jobDetails?.job_description ? (
                                    <div dangerouslySetInnerHTML={{__html: jobDetails.job_description}}/>
                                ) : (
                                    <p>No job description provided.</p>
                                )}
                            </div>

                            {/* Requirement Skills */}
                            <div className="mb-5">
                                <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                                    <span className="icon-align-left mr-3"></span>Requirement Skill
                                </h3>

                                {jobDetails?.required_skills ? (
                                    <div dangerouslySetInnerHTML={{__html: jobDetails.required_skills}}/>
                                ) : (
                                    <p>No job description provided.</p>
                                )}
                            </div>

                            {/* Apply Now Button */}

                        </div>

                        <div className="col-lg-4">
                            {/* Job Summary */}
                            <div className="bg-light p-3 border rounded mb-4">
                                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Job Summary</h3>
                                <ul className="list-unstyled pl-3 mb-0">
                                    <li className="mb-2">
                                        <strong className="text-black">Published on:</strong>{' '}
                                        {jobDetails?.posted_date
                                            ? format(new Date(jobDetails.posted_date), 'MMMM d, yyyy h:mm a')
                                            : 'Not specified'}
                                    </li>
                                    <li className="mb-2">
                                        <strong className="text-black">Employment Status:</strong>{' '}
                                        {jobDetails?.job_type || 'Not specified'}
                                    </li>
                                    <li className="mb-2">
                                        <strong className="text-black">Experience:</strong>{' '}
                                        {jobDetails?.experience || 'Not specified'}
                                    </li>
                                    <li className="mb-2">
                                        <strong className="text-black">Salary:</strong>{' '}
                                        {jobDetails?.salary_range || 'Not specified'}
                                    </li>
                                    <li className="mb-2">
                                        <strong className="text-black">Location:</strong>{' '}
                                        {jobDetails?.location || 'Not specified'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </div>
    );
}

export default JobSingle;
