import React, {useEffect, useState} from "react";
import '../styles/jobboard.css';
import Helmet from "react-helmet";  // Nhập file CSS chính
import '../styles/animate.min.css'
import '../styles/custom-bs.css'
import '../styles/jquery.fancybox.min.css'
import '../styles/bootstrap-select.min.css'
import '../styles/owl.carousel.min.css'
import 'icomoon/style.css';

import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import $ from 'jquery';
import {Link, useNavigate} from "react-router-dom";
import jobLogo from "../images/job_logo_1.jpg";
import Footer from "./Footer";

const JobBoard = () => {
    $(document).ready(function() {
        console.log('jQuery is ready!');
    });
    const [jobPostings, setJobPostings] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const [searchFilters, setSearchFilters] = useState({
        title: '',
        location: '',
        experience: ''
    });
    localStorage.removeItem('token');
    const [filteredJobs, setFilteredJobs] = useState([]);
    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await fetch('http://localhost:3001/job-postings');
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu');
                }
                const data = await response.json();
                setJobPostings(data);  // Update state with fetched data
                setFilteredJobs(data)
            } catch (error) {
                console.error('Lỗi khi lấy job postings:', error);
            }
        };

        fetchJobPostings();
    }, []); // Empty dependency array to run once on mount
    const handleJobClick = (jobId) => {
        navigate(`/job-single/${jobId}`);
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = jobPostings.filter(job => {
            return (
                (searchFilters.title === '' || (job.job_title || '').toLowerCase().includes(searchFilters.title.toLowerCase())) &&
                (searchFilters.location === '' || (job.location || '').toLowerCase().includes(searchFilters.location.toLowerCase())) &&
                (searchFilters.experience === '' || (job.experience || '').toLowerCase().includes(searchFilters.experience.toLowerCase()))
            );
        });
        setFilteredJobs(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters({ ...searchFilters, [name]: value });
    };


    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5; // Number of jobs per page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Next and Previous buttons
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredJobs.length / jobsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div className="site-wrap">
            <div className="site-mobile-menu site-navbar-target">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle"></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body"></div>
            </div>
            {/* .site-mobile-menu */}

            {/* NAVBAR */}
            <header className="site-navbar mt-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="site-logo col-6">
                            <a href="/">JobBoard</a>
                        </div>

                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="/" className="nav-link active">Home</a></li>
                                <li><a href="about.html">About</a></li>
                                <li className="has-children">
                                    <a href="/login-1">Post Job</a>
                                </li>

                                <li><a href="/login-1">AI Filtering</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                {/*<li className="d-lg-none"><a href="post-job.html"><span className="mr-2">+</span> Post a*/}
                                {/*    Job</a></li>*/}
                                {/*<li className="d-lg-none"><a href="login.html">Log In</a></li>*/}
                            </ul>
                        </nav>

                        <div className="right-cta-menu text-right d-flex align-items-center col-6">
                            <div className="ml-auto">

                                <Link to="/login-1"
                                      className="btn btn-outline-white border-width-2 d-none d-lg-inline-block">

                                    <span className="mr-2 icon-add">Post a Job</span>
                                </Link>

                                <Link to="/login-1" className="btn btn-primary border-width-2 d-none d-lg-inline-block">

                                    <span className="mr-2 icon-lock_outline">Login</span>
                                </Link>
                            </div>
                            <a href="#"
                               className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3">
                                <span className="icon-menu h3 m-0 p-0 mt-2"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* HOME */}
            <section
                className="home-section section-hero overlay bg-image"
                style={{backgroundImage: `url(${require('../images/hero_1.jpg')})`}}
                id="home-section"
            >

                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-12">
                            <div className="mb-5 text-center">
                                <h1 className="text-white font-weight-bold">The Easiest Way To Get Your Dream Job</h1>
                                {/*<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate est,*/}
                                {/*    consequuntur*/}
                                {/*    perferendis.</p>*/}
                            </div>
                            <form onSubmit={handleSearch} className="search-jobs-form">
                                <div className="row mb-5">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <input
                                            type="text"
                                            name="title"
                                            value={searchFilters.title}
                                            onChange={handleInputChange}
                                            className="form-control form-control-lg"
                                            placeholder="Job title..."
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <input
                                            type="text"
                                            name="location"
                                            value={searchFilters.location}
                                            onChange={handleInputChange}
                                            className="form-control form-control-lg"
                                            placeholder="Location..."
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <input
                                            type="text"
                                            name="experience"
                                            value={searchFilters.experience}
                                            onChange={handleInputChange}
                                            className="form-control form-control-lg"
                                            placeholder="Experience..."
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg btn-block text-white btn-search"
                                        >
                                            <span className="icon-search icon mr-2"></span>Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <a href="#next" className="scroll-button smoothscroll">
                    <span className="fa-solid fa-chevron-down"></span>
                </a>
            </section>

            <section
                className="py-5 bg-image overlay-primary fixed overlay"
                style={{backgroundImage: `url(${require('../images/hero_1.jpg')})`}}
                id="next"
            >

                <div className="container">
                    <div className="row mb-5 justify-content-center">
                        <div className="col-md-7 text-center">
                            <h2 className="section-title mb-2 text-white">JobBoard Site Stats</h2>
                            {/*<p className="lead text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit.*/}
                            {/*    Expedita unde officiis recusandae sequi excepturi corrupti.</p>*/}
                        </div>
                    </div>
                    <div className="row pb-0 block__19738 section-counter">
                        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <strong className="number" data-number="1930">0</strong>
                            </div>
                            <span className="caption">Candidates</span>
                        </div>

                        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <strong className="number" data-number="54">{jobPostings.length}</strong>

                            </div>
                            <span className="caption">Jobs Posted</span>
                        </div>

                        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <strong className="number" data-number="120">0</strong>
                            </div>
                            <span className="caption">Jobs Filled</span>
                        </div>

                        <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <strong className="number" data-number="550">0</strong>
                            </div>
                            <span className="caption">Companies</span>
                        </div>
                    </div>
                </div>
            </section>


            <section className="site-section">
                <div className="container">

                    <div className="row mb-5 justify-content-center">
                        <div className="col-md-7 text-center">
                            <h2 className="section-title mb-2">{jobPostings.length} Job Listed</h2>
                        </div>
                    </div>

                    <ul className="job-listings mb-5">
                        {currentJobs.length > 0 && filteredJobs.length > 0 ? (
                            currentJobs.map((job) => (
                                <li key={job.id}
                                    className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center"
                                    onClick={() => handleJobClick(job.id)}>
                                    <div className="job-listing-logo">
                                        {/* Đảm bảo sử dụng đúng giá trị image_url */}
                                        <img
                                            src={`http://localhost:3001${job.image_url}`}
                                            className="img-fluid"
                                            alt="Job Logo"
                                        />
                                    </div>

                                    <div
                                        className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                                        <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                                            <h2>{job.job_title}</h2>
                                            <strong> Job Experience: {job.experience || 'Unknown Company'}</strong>
                                        </div>
                                        <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                                            <span
                                                className="icon-room"></span> {job.location || 'Location not specified'}
                                        </div>
                                        <div className="job-listing-meta">
                                            <span
                                                className={`badge ${job.job_type === 'Full Time' ? 'badge-success' : 'badge-danger'}`}>
                                                {job.job_type}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No job postings available.</p>
                        )}
                    </ul>

                    <div className="row pagination-wrap">
                        <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                            <span>
                                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} Jobs
                            </span>
                        </div>
                        <div className="col-md-6 text-center text-md-right">
                            <div className="custom-pagination ml-auto">
                                <button style={{
                                    backgroundColor: "#89ba16",
                                    borderRadius: "20px",
                                    margin: "5px",
                                    border: "none"
                                }} className="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Prev
                                </button>
                                {[...Array(Math.ceil(filteredJobs.length / jobsPerPage)).keys()].map((num) => (
                                    <button style={{
                                        backgroundColor: "#89ba16",
                                        borderRadius: "20px",
                                        margin: "5px",
                                        border: "none"
                                    }}
                                            key={num + 1}
                                            onClick={() => paginate(num + 1)}
                                            className={currentPage === num + 1 ? "active" : ""}
                                    >
                                        {num + 1}
                                    </button>
                                ))}
                                <button style={{
                                    backgroundColor: "#89ba16",
                                    borderRadius: "20px",
                                    margin: "5px",
                                    border: "none"
                                }}
                                        className="next"
                                        onClick={handleNextPage}
                                        disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </div>
    );
};
export default JobBoard;
