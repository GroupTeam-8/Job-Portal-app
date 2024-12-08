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
const ApplicantDetails = () => {
    const { id } = useParams();
    const [applicant, setApplicant] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRejected, setIsRejected] = useState(false); // Trạng thái từ chối
    const navigate = useNavigate();
    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/applicants/${id}`);
                if (!response.ok) throw new Error('Failed to fetch applicant details');
                const data = await response.json();
                setApplicant(data);
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
            navigate('/ai-cv-filtering');
            setIsRejected(true); // Cập nhật trạng thái từ chối
            alert('Ứng viên đã bị từ chối.');
        } catch (error) {
            console.error('Error rejecting applicant:', error);
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
                            <a href="index.html">JobBoard</a>
                        </div>

                        <nav className="mx-auto site-navigation">
                            <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                                <li><a href="index.html" className="nav-link active">Home</a></li>
                                <li><a href="about.html">About</a></li>
                                <li className="has-children">
                                    <a href="job-listings.html">Job Listings</a>
                                    <ul className="dropdown">
                                        <li><a href="job-single.html">Job Single</a></li>
                                        <li><a href="post-job.html">Post a Job</a></li>
                                    </ul>
                                </li>


                                <Link to="/list-job">
                                    <span>AI Filtering</span>
                                </Link>
                                <li><a href="contact.html">Contact</a></li>
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

                            {loading ? (
                                <p>Loading applicant details...</p>
                            ) : error ? (
                                <p style={{ color: 'red' }}>Error: {error}</p>
                            ) : (
                                applicant ? (
                                    <>
                                        <h2>Applicant Name: {applicant.name}</h2>
                                        <p><strong>Email:</strong> {applicant.email}</p>
                                        <p><strong>Cover Letter:</strong> {applicant.cover_letter}</p>

                                        <label htmlFor="job-description">Job Description</label>
                                        <textarea id="job-description" readOnly value={applicant.job_description} />

                                        <label htmlFor="required-skills">Required Skills</label>
                                        <textarea id="required-skills" readOnly value={applicant.required_skills} />

                                        <div className="button-container">
                                            <a href={`http://localhost:3001/${applicant.cv}`} target="_blank" rel="noopener noreferrer"
                                               className="button">View Full CV</a>
                                            <button className="button shortlist" type="button" onClick={handleEvaluateClick}
                                                    disabled={isEvaluating}>
                                                {isEvaluating ? 'Evaluating...' : 'Shortlist'}
                                            </button>
                                            <button className="button reject" type="button" onClick={handleRejectClick}
                                                    disabled={isRejected}>
                                                {isRejected ? 'Rejected' : 'Reject'}
                                            </button>

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
            </section>
        </div>

    )
}


    export default ApplicantDetails;





<Helmet>
    <style>{`


body {

    font-family: Arial, sans-serif;
    background-color: #f4f4f4;

    justify-content: center;
    display: block;
}

.container {

    max-width: 620px;
    margin: 50px auto;
    background-color: white;
    padding: 40px 90px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}

h2, p {
    margin: 10px 0;
}

textarea {
    width: 100%;
    height: 250px;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
    background-color: #f4f4f4;
    font-size: 15px
}

.button {
    padding: 10px 2px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    display: block;
    margin: 20px auto;
    text-align: center;
}

.button:hover {
    background-color: #0056b3;
}

.button.shortlist {
    background-color: #28a745;
}

.button.shortlist:hover {
    background-color: #218838;
}

.button.reject {
    background-color: #dc3545;
}

.button.reject:hover {
    background-color: #c82333;
}

.button-container {
    text-align: center;
    margin-top: 20px;
}
.evaluation-result {
    background-color: #f0f8ff; /* Light background for readability */
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
}

.evaluation-result h3 {
    color: #003366; /* Dark blue for heading */
}

.evaluation-result p {
    color: #333;
    font-size: 1rem;
    line-height: 1.5;
}

.evaluation-result p .highlight {
    font-weight: bold;
    color: #0066cc;
}

        `}</style>
</Helmet>
