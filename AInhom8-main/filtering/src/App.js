import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import ApplicantHome from './components/applicant/ApplicantHome';
import RecruiterHome from './components/RecruiterHome';
import ForgotPassword from './components/ForgotPassword';
import JobPostingList from './components/JobPostingList'; // Import JobPostingList
import CandidateSearch from './components/recruiter/CandidateSearch';
import AiCvFiltering from "./components/recruiter/AiCvFiltering";
import JobSearch from "./components/JobSearch";
import CandidateProfile from "./components/applicant/CandidateProfile";
import JobDetails   from "./components/JobDetails";
// import './App.css';
import ApplicationForm from "./components/applicant/ApplicationForm";
import ApplicantDetails from "./components/recruiter/ApplicantDetails";
import ApplicationStatus from './components/ApplicationStatus'; // Import your components
import ApplicationDetails from './components/ApplicationDetails'; // Import the ApplicationDetails component
import ChangePassword from './components/ChangePassword'; // Import component mới
import JobBoard from './components/JobBoard';
import CvEvaluation from './components/recruiter/CvEvaluation';
import PostJob from "./components/recruiter/PostJob";
import Login1 from "./components/auth/login1";
import JobBoardMain from "./components/recruiter/JobBoardMain";
import JobSingle from "./components/JobSingle";
import JobList from "./components/recruiter/JobList";
import ApplicationList from './components/recruiter/ApplicationList';
import Signup1 from "./components/auth/signup1";
import AboutPage from "./components/AboutPage";
import ContactUs from "./components/ContactUs";
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Đường dẫn mặc định đến trang đăng nhập */}
                    <Route path="/" element={<JobBoard />} />

                    {/* Đường dẫn đến trang của applicant */}
                    <Route path="/ApplicantHome" element={<ApplicantHome />} />

                    {/* Đường dẫn đến trang của recruiter */}
                    <Route path="/RecruiterHome" element={<RecruiterHome />} />

                    {/* Đường dẫn đến trang danh sách bài đăng việc làm */}
                    <Route path="/job-postings" element={<JobPostingList />} />

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/candidate-search" element={<CandidateSearch />} />
                    <Route path="/ai-cv-filtering" element={<AiCvFiltering />} />
                    <Route path="/job-search" element={<JobSearch />} />
                    <Route path="/candidate-profile" element={<CandidateProfile />} />
                    <Route path="/job-details" element={<JobDetails />} />
                    <Route path="/application-form" element={<ApplicationForm />} />
                    <Route path="/applicant/:id" element={<ApplicantDetails />} />
                    <Route path="/application-status" element={<ApplicationStatus />} />
                    <Route path="/application-details" element={<ApplicationDetails />} />
                    <Route path="/change-password" element={<ChangePassword />} /> {/* Route đổi mật khẩu */}
                    <Route path="/cv-Evaluation" element={<CvEvaluation />} />
                    <Route path="/Job-Board" element={<JobBoard />} />
                    <Route path="/Post-Job" element={<PostJob />} />
                    <Route path="/login-1" element={<Login1/>} />
                    <Route path="/Job-BoardMain" element={<JobBoardMain />} />
                    <Route path="/job-single/:jobId" element={<JobSingle />} />
                    <Route path="/list-job" element={<JobList />} />
                    <Route path="/job-single1/:jobId" element={<ApplicationList />} />
                    <Route path="/sign-up1" element={<Signup1 />} />
                    <Route path="/about-page" element={<AboutPage />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
