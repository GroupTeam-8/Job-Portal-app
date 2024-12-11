import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
// import '../../styles/ApplicantDetails.css';
// import '../../styles/global.css';
import Helmet from 'react-helmet';
import '../../styles/jobboard.css';

import '../../styles/animate.min.css'
import '../../styles/custom-bs.css'
import '../../styles/jquery.fancybox.min.css'
import '../../styles/bootstrap-select.min.css'
import '../../styles/owl.carousel.min.css'
import 'icomoon/style.css';
import jobLogo from '../../images/job_logo_1.jpg';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import {ThemeConsumer} from "react-bootstrap/ThemeProvider";
import ApplicationForm from "../applicant/ApplicationForm";
import FeedbackModal from "./FeedbackModal";
const ApplicantDetails = () => {
    const { id } = useParams();
    const [applicant, setApplicant] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRejected, setIsRejected] = useState(false); // Trạng thái từ chối
    const [isAccepted, setIsAccepted] = useState(false); // Trạng thái từ chối
    const navigate = useNavigate();
    const [applicantName, setApplicantName] = useState('');
    const [emailName, setemailName] = useState('');
    const [company, setCompany] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/applicants/${id}`);
                if (!response.ok) throw new Error('Failed to fetch applicant details');
                const data = await response.json();
                console.log(data)
                setApplicant(data);
                setApplicantName(data.name);
                setemailName(data.email);
                setCompany(data.company);
                setJobTitle(data.job_title);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applicant details:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchApplicant();
    }, [id]);

    const handleEvaluateClick = async () => {
        if (applicant) {
            setIsEvaluating(true);
            const { job_description: jobDescription, required_skills: requiredSkills, cv } = applicant;

            try {
                const response = await fetch(`http://localhost:3001/${cv}`);
                if (!response.ok) throw new Error('Failed to fetch CV file');
                const blob = await response.blob();
                const cvFile = new File([blob], 'CV_File.pdf');

                const formData = new FormData();
                formData.append('job_description', jobDescription);
                formData.append('required_skills', requiredSkills);
                formData.append('cv_file', cvFile);

                const evaluateResponse = await fetch('http://localhost:3001/api/evaluate_cv', {
                    method: 'POST',
                    body: formData,
                });

                if (!evaluateResponse.ok) throw new Error('Network response was not successful');

                const result = await evaluateResponse.json();
                setEvaluationResult(result.evaluation_result);
            } catch (error) {
                console.error('Error during CV evaluation:', error);
                setError(error.message);
            } finally {
                setIsEvaluating(false);
            }
        } else {
            console.error('Applicant data does not exist');
        }
    };
    const handleRejectClick = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/applicants/${id}/reject`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to reject applicant');
            }
            navigate('/list-job');
            setIsRejected(true); // Cập nhật trạng thái từ chối
            alert('Ứng viên đã bị từ chối.');
        } catch (error) {
            console.error('Error rejecting applicant:', error);
        }
    };
    const handleAcceptClick = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/applicants/${id}/accept`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to accept applicant');
            }
            navigate('/list-job');
            setIsAccepted(true); // Cập nhật trạng thái từ chối
            alert('ứng viên đã được accept.');
        } catch (error) {
            console.error('Error accept applicant:', error);
        }
    };


    const parseEvaluationResult = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={index}>
                        {parts.map((part, idx) =>
                            idx % 2 === 1 ? <span key={idx} className="highlight">{part}</span> : part
                        )}
                    </p>
                );
            }
            return <p key={index}>{line}</p>;

        });
    };
    const parseEvaluationResultt = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.includes('##')) {
                const parts = line.split('##');
                return (
                    <h1 key={index}>
                        {parts.map((part, idx) =>
                            idx % 2 === 1 ? <span key={idx} className="highlight">{part}</span> : part
                        )}
                    </h1>
                );
            }
            return <p key={index}>{line}</p>;

        });
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
                            <a href="/Job-BoardMain">JobBoard</a>
                        </div>

                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="/Job-BoardMain" className="nav-link active">Home</a></li>
                                <li><a href="/about-page">About</a></li>
                                <li className="has-children">
                                    <a href="/Post-Job">Post job</a>

                                </li>


                                <Link to="/list-job">
                                    <span>AI Filtering</span>
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


            <div>
                <section

                >
                    <div className="home-section section-hero overlay bg-image" id="home-section">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <Helmet>
                                        <style>
                                            {
                                                `
                                            .col-md-12 {
                                            
                                            background-color:white;
                                            padding: 75px 85px;
                                            }
                                            .container p {
                                            color:black;
                                            }

                                      .applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.applicant-header h2 {
  margin-right: 10px;  /* Đảm bảo khoảng cách giữa tên ứng viên và nút */
}

.view-cv {
  background-color: #4CAF50; /* Hoặc bất kỳ màu nào bạn muốn */
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}

.view-cv:hover {
  background-color: #45a049;
}
                                        `
                                            }

                                        </style>
                                    </Helmet>


                                    {loading ? (
                                        <p>Loading applicant details...</p>
                                    ) : error ? (
                                        <p style={{color: 'red'}}>Error: {error}</p>
                                    ) : (
                                        applicant ? (
                                            <>
                                                <div  className="applicant-header">
                                                    <h2 >Applicant Name: {applicant.name}</h2>
                                                    <a  href={`http://localhost:3001/${applicant.cv}`} target="_blank"
                                                       rel="noopener noreferrer" className="button view-cv">
                                                        View Full CV
                                                    </a>
                                                </div>
                                                <p><strong>Email:</strong> {applicant.email}</p>
                                                <p><strong>Cover Letter:</strong> {applicant.cover_letter}</p>

                                                <label htmlFor="job-description">Job Description</label>
                                                {applicant?.required_skills ? (
                                                    <div dangerouslySetInnerHTML={{__html: applicant.job_description}}/>
                                                ) : (
                                                    <p>No job description provided.</p>
                                                )}
                                                <label htmlFor="required-skills">Required Skills</label>
                                                {applicant?.required_skills ? (
                                                    <div dangerouslySetInnerHTML={{__html: applicant.required_skills}}/>
                                                ) : (
                                                    <p>No job description provided.</p>
                                                )}

                                                <div className="button-container">

                                                    <button className="button shortlist" type="button"
                                                            onClick={handleEvaluateClick}
                                                            disabled={isEvaluating}>
                                                        {isEvaluating ? 'Evaluating...' : 'Shortlist'}
                                                    </button>

                                                    <button className="button reject" type="button"
                                                            onClick={handleRejectClick}
                                                            disabled={isRejected}>
                                                        {isRejected ? 'Rejected' : 'Reject'}

                                                    </button>

                                                    <button className="button accept" type="button"
                                                            onClick={handleAcceptClick}
                                                            disabled={isAccepted}>
                                                        {isAccepted ? 'Accepted' : 'Accept'}

                                                    </button>
                                                    <button onClick={openModal} className="button" type="button"
                                                            style={{backgroundColor: '#11FFFF'}}>Send Feedback
                                                    </button>
                                                    <FeedbackModal isOpen={isModalOpen} onClose={closeModal}
                                                                   applicantName={applicantName} emailName={emailName}
                                                                   company={company} jobTitle={jobTitle}/>


                                                </div>

                                                {evaluationResult && (
                                                    <div className="evaluation-result">
                                                        <h3>Evaluation Result</h3>
                                                        {parseEvaluationResult(evaluationResult)}
                                                    </div>

                                                )}
                                            </>
                                        ) : (
                                            <p>Applicant details not found.</p>
                                        )
                                    )}


                                </div>

                            </div>

                        </div>

                    </div>


                </section>

            </div>
        </div>

    )
}


export default ApplicantDetails;

