import React, { useState, useEffect } from "react";
import '../../styles/jobboard.css';
import Helmet from "react-helmet";  // Nhập file CSS chính
import '../../styles/animate.min.css'
import '../../styles/custom-bs.css'
import '../../styles/jquery.fancybox.min.css'
import '../../styles/bootstrap-select.min.css'
import '../../styles/owl.carousel.min.css'
import 'icomoon/style.css';
import jobLogo from '../../images/job_logo_1.jpg';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import $ from 'jquery';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer";
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
import axios from "axios";
import EvaluationResultsModal from './EvaluationResultsModal'; // Thay đổi đường dẫn đúng với cấu trúc dự án của bạn
import Chatbox from "../applicant/ChatBox";

const JobList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
    const [error, setError] = useState(null);
    const [evaluationResults, setEvaluationResults] = useState([]);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [jobApplications, setJobApplications] = useState([]); // Renamed to match the context
    const navigate = useNavigate();
    const [applicant, setApplicant] = useState(null);
    const [Name, setName] = useState('');

    const [Email, setEmail] = useState('');
    const [Tittle, setTittle] = useState('');
    const [id, setId] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        title: '',
        name: '',
        experience: ''
    });
    const [filteredJobs, setFilteredJobs] = useState([]);
    useEffect(() => {
        const fetchJobApplications = async () => {
            const userId = localStorage.getItem('userId');  // Lấy userId từ localStorage
            console.log(userId); // Kiểm tra xem giá trị có đúng hay không

            try {
                const response = await axios.get('http://localhost:3001/api/applicants', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Gửi token vào header
                    }
                });

                // Kiểm tra dữ liệu trả về
                const data = response.data; // Axios tự động parse dữ liệu JSON
                console.log(data); // Kiểm tra dữ liệu trả về
                const names = data.map(item => item.name);
                const emails = data.map(item => item.email);
                const tittles = data.map(item => item.job_title);
                const ids = data.map(item => item.id);
                setName(names);
                setEmail(emails);
                setTittle(tittles);
                setId(ids);


                // Lọc các ứng viên có trạng thái 'pending' và so sánh recruiter_id với userId
                const filteredApplicants = data.filter(applicant =>
                    applicant.status === 'pending' && applicant.recruiter_id === parseInt(userId)  // So sánh recruiter_id với userId
                );

                // Cập nhật state với danh sách ứng viên đã lọc
                setApplicants(filteredApplicants);
                setJobApplications(filteredApplicants);
                setFilteredJobs(filteredApplicants);
            } catch (error) {
                console.error('Error fetching job applications:', error);  // Đảm bảo lỗi được ghi rõ
            }
        };



        fetchJobApplications();
    }, []);



    const handleEvaluateAllClick = async () => {
        setIsModalOpen(true);
        if (jobApplications && jobApplications.length > 0) {
            setIsEvaluating(true);

            try {
                // Đánh giá tất cả các CV của ứng viên
                const evaluations = await Promise.all(
                    jobApplications.map(async (application) => {
                        const { job_description: jobDescription, required_skills: requiredSkills, cv } = application;

                        const response = await fetch(`${cv}`);
                        if (!response.ok) throw new Error('Failed to fetch CV file');
                        const blob = await response.blob();
                        const cvFile = new File([blob], 'CV_File.pdf');

                        const formData = new FormData();
                        formData.append('job_description', jobDescription);
                        formData.append('required_skills', requiredSkills);
                        formData.append('cv_file', cvFile);

                        // Gửi dữ liệu để đánh giá CV
                        const evaluateResponse = await fetch('http://localhost:3001/api/evaluate_cv', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!evaluateResponse.ok) throw new Error('Error during evaluation');

                        const result = await evaluateResponse.json();
                        return result.evaluation_result; // Trả về kết quả đánh giá
                    })
                );

                // Cập nhật kết quả đánh giá vào state
                setEvaluationResults(evaluations);
            } catch (error) {
                console.error('Error during bulk CV evaluation:', error);
                setError(error.message);
            } finally {
                setIsEvaluating(false);
            }
        } else {
            console.error('No job applications found');
        }
    };



    const handleShortlistClick = (applicantId) => {
        navigate(`/applicant/${applicantId}`);
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = jobApplications.filter(application => {
            return (
                (searchFilters.title === '' || application.job_title.toLowerCase().includes(searchFilters.title.toLowerCase())) &&
                (searchFilters.name === '' || application.name.toLowerCase().includes(searchFilters.name.toLowerCase())) &&
                (searchFilters.experience === '' || application.experience.toLowerCase().includes(searchFilters.experience.toLowerCase()))
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
    const handleEvaluateResponse = (response) => {
        const results = response.results.map(result => {
            // Tìm số trước dấu '%'
            const match = result.match(/(\d+)%/);

            if (match) {
                // Lấy hai chữ số đầu tiên nếu có
                const percentage = match[1].slice(0, 2);
                return `${percentage}%`;
            } else {
                return "Không xác định"; // Nếu không tìm thấy tỷ lệ phần trăm
            }
        });

        console.log(results); // Hiển thị kết quả trong console hoặc cập nhật UI
        return results;
    };
console.log(evaluationResults)
    console.log(Tittle)
    console.log(Name)
    console.log(id)
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
            {/* NAVBAR */}
            <header className="site-navbar mt-3">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="site-logo col-6">
                            <a href="/Job-BoardMain">JobBoard</a>
                        </div>

                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="/Job-BoardMain" className="nav-link active">Home</a></li>
                                <li><a href="/about-page">About</a></li>
                                <li className="has-children">
                                    <a href="/Post-Job">Post job</a>

                                </li>


                                <Link style={{color:'rgba(255, 255, 255, 0.5)'}} to="/list-job">
                                    <span >AI Filtering</span>
                                </Link>
                                <li><a href="/contact-us">Contact</a></li>
                                {/*<li className="d-lg-none"><a href="post-job.html"><span className="mr-2">+</span> Post a*/}
                                {/*    Job</a></li>*/}
                                {/*<li className="d-lg-none"><a href="login.html">Log In</a></li>*/}
                            </ul>
                        </nav>

                        <div className="right-cta-menu text-right d-flex align-items-center col-6">
                            <div className="ml-auto">

                                <Link to="/Post-Job"
                                      className="btn btn-outline-white border-width-2 d-none d-lg-inline-block">

                                    <span className="mr-2 icon-add">Post a Job</span>
                                </Link>

                                <Link to="/Job-Board"
                                      className="btn btn-primary border-width-2 d-none d-lg-inline-block">

                                    <span className="mr-2 icon-lock_outline">Logout</span>
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
                style={{backgroundImage: `url(${require('../../images/hero_1.jpg')})`}}
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
                                            name="name"
                                            value={searchFilters.name}
                                            onChange={handleInputChange}
                                            className="form-control form-control-lg"
                                            placeholder="Applicant name..."
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
            </section>


            <section className="site-section">
                <div className="container">

                    <div className="row mb-5 justify-content-center">
                        <div className="col-md-7 text-center">
                            {/* Dynamically display the number of job postings */}
                            <h2 className="section-title mb-2">{jobApplications.name} Job Listed</h2>
                            <button onClick={handleEvaluateAllClick} className="btn btn-primary">
                                Đánh giá tất cả
                            </button>
                            <EvaluationResultsModal
                                EvaluationResults={evaluationResults}
                                name={Name}
                                email={Email}
                                jobTitle={Tittle}
                                ID={id}
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                            />



                        </div>
                    </div>

                    <ul className="job-listings mb-5">
                        {currentJobs.length > 0 ? (
                            currentJobs.map((application) => (
                                <li key={application.id}
                                    className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center"
                                >


                                    <div className="job-listing-logo">
                                        <div className="job-listing-logo">
                                            <iframe
                                                src={`${application.cv}#page=1`}
                                                width="100%"
                                                height="100%"
                                                title="PDF Viewer"
                                                style={{border: "none"}}
                                            >
                                            </iframe>
                                        </div>

                                    </div>
                                    <div
                                        className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                                        <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                                            <h2>{application.name}</h2>
                                            <strong>Job Title: {application.job_title}</strong>

                                        </div>
                                        <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                                            <span
                                                className="icon-room"></span>Experience: {application.experience || 'Unknown Experience'}
                                            <div style={{


                                                padding: '0.5em 1em'
                                            }}

                                                 className="job-listing-meta">
                                            <span
                                                style={{

                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    borderRadius: '0.25rem',
                                                    color: '#fff',
                                                    backgroundColor:
                                                        application.status === 'rejected' ? '#FF0000' :
                                                            application.status === 'pending' ? '#007bff' : '#dc3545'
                                                }}
                                                className={`badge ${application.status === 'rejected' ? 'badge-success' :
                                                    application.status === 'pending' ? 'badge-pending' : 'badge-danger'}`}>
                                                {application.status}
                                            </span>

                                            </div>

                                        </div>


                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                            <button onClick={() => handleShortlistClick(application.id)} type="submit"
                                                    className="btn btn-primary btn-lg btn-block text-white btn-search"><span
                                                className="icon-search icon mr-2"></span>Shortlist
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No job applications available.</p>
                        )}
                    </ul>
                    <div className="row pagination-wrap">
                        <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                            <span>
                                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} Jobs
                            </span>
                        </div>
                        <div className="col-md-6 text-center text-md-right">
                            <div  className="custom-pagination ml-auto">
                                <button style={{backgroundColor:"#89ba16",borderRadius:"20px",margin:"5px",border:"none"}} className="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Prev
                                </button>
                                {[...Array(Math.ceil(filteredJobs.length / jobsPerPage)).keys()].map((num) => (
                                    <button style={{backgroundColor:"#89ba16",borderRadius:"20px",margin:"5px",border:"none"}}
                                        key={num + 1}
                                        onClick={() => paginate(num + 1)}
                                        className={currentPage === num + 1 ? "active" : ""}
                                    >
                                        {num + 1}
                                    </button>
                                ))}
                                <button style={{backgroundColor:"#89ba16",borderRadius:"20px",margin:"5px",border:"none"}}
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
            <Chatbox/>

        </div>
    );
};
export default JobList;
