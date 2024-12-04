import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from './Footer'; // Import Footer component
import '../styles/jobboard.css';
import Helmet from "react-helmet"; // Import Helmet for additional functionalities
import '../styles/animate.min.css';
import '../styles/custom-bs.css';
import '../styles/jquery.fancybox.min.css';
import '../styles/bootstrap-select.min.css';
import '../styles/owl.carousel.min.css';
import 'icomoon/style.css';
import jobLogo from '../images/job_logo_1.jpg';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';

const AboutPage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
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
              } catch (err) {
                setError(err.response ? err.response.data.message : 'Lỗi kết nối');
              }
        };
        fetchUserData();
    }, []); //
    return (
        <div>
            {/* Header */}
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
                                {user ? (
                                    user.userType === 'manager'
                                    ?  <div>
                                        <li><a href="/Post-Job">Post job</a></li>
                                        <li><Link to="/list-job"><span>AI Filtering</span></Link></li>
                                    </div>
                                    
                                    :<button className="btn btn-block btn-primary btn-md">Edit Job
                                        </button>
                                ) : (
                                    <p className='display none'></p>
                                )}
                              
                                
                                <li><a href="/contact-us">Contact</a></li>
                            </ul>
                        </nav>

                        <div className="right-cta-menu text-right d-flex align-items-center col-6">
                            <div className="ml-auto">
                                <Link to="/Post-Job" className="btn btn-outline-white border-width-2 d-none d-lg-inline-block">
                                    <span className="mr-2 icon-add">Post a Job</span>
                                </Link>
                                <Link to="/Job-Board" className="btn btn-primary border-width-2 d-none d-lg-inline-block">
                                    <span className="mr-2 icon-lock_outline">Logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="section-hero overlay inner-page bg-image"
                style={{ backgroundImage: `url(${require('../images/hero_1.jpg')})` }}
                id="home-section"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">About Us</h1>
                            <div className="custom-breadcrumbs">
                                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                                <span className="text-white"><strong>About Us</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Sections */}
            <VideoSection
                title="JobBoard For Freelancers, Web Developers"
                image={require('../images/sq_img_6.jpg')}
                // description="Eveniet voluptatibus voluptates suscipit minima, cum voluptatum ut dolor."
                url="https://vimeo.com/317571768"
            />
            <VideoSection
                title="JobBoard For Workers"
                image={require('../images/sq_img_8.jpg')}
                // description="Eveniet voluptatibus voluptates suscipit minima, cum voluptatum ut dolor."
                url="https://vimeo.com/317571768"
                reverse
            />

            {/* Team Section */}
            <section className="site-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12 text-center" data-aos="fade">
                            <h2 className="section-title mb-3">Our Team</h2>
                        </div>
                    </div>

                    <div className="row align-items-center block__69944">
                        {[{
                            name: "Elisabeth Smith",
                            role: "Creative Director",
                            image: require('../images/person_6.jpg'),
                            description: "Creative and professional director with 10+ years of experience.",
                        }, {
                            name: "Chintan Patel",
                            role: "Marketing Manager",
                            image: require('../images/person_5.jpg'),
                            description: "Marketing expert leading innovative campaigns worldwide.",
                        }].map((teamMember, index) => (
                            <TeamMember key={index} {...teamMember} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

// VideoSection Component
const VideoSection = ({ title, image, description, url, reverse }) => (
    <section className="site-section pb-0">
        <div className="container">
            <div className={`row align-items-center ${reverse ? "flex-row-reverse" : ""}`}>
                <div className="col-lg-6 mb-5 mb-lg-0">
                    <a data-fancybox data-ratio="2" href={url} className="block__96788">
                        <span className="play-icon"><span className="icon-play"></span></span>
                        <img src={image} alt="Image" className="img-fluid img-shadow" />
                    </a>
                </div>
                <div className="col-lg-5 ml-auto">
                    <h2 className="section-title mb-3">{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    </section>
);

// TeamMember Component
const TeamMember = ({ name, role, image, description }) => (
    <div className="col-md-6">
        <img src={image} alt="Image" className="img-fluid mb-4 rounded" />
        <h3>{name}</h3>
        <p className="text-muted">{role}</p>
        <p>{description}</p>
        <div className="social mt-4">
            <a href="#"><span className="icon-facebook"></span></a>
            <a href="#"><span className="icon-twitter"></span></a>
            <a href="#"><span className="icon-instagram"></span></a>
            <a href="#"><span className="icon-linkedin"></span></a>
        </div>

    </div>

);

export default AboutPage;
