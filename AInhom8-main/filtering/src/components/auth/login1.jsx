import React, { useState } from 'react';
import axios from 'axios';  // Import axios để gửi yêu cầu HTTP
import '../../styles/jobboard.css';
import Helmet from "react-helmet";
import '../../styles/animate.min.css'
import '../../styles/custom-bs.css'
import '../../styles/jquery.fancybox.min.css'
import '../../styles/bootstrap-select.min.css'
import 'icomoon/style.css';
import {Link, useNavigate} from 'react-router-dom';  // Import useNavigate
const SignUpLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Khởi tạo useNavigate
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
        if (password !== rePassword) {

            setError('Mật khẩu không khớp');
            return;
        }

        // Gửi yêu cầu đăng ký tới backend
        try {
            const response = await axios.post('http://localhost:3001/signup', {
                email,
                password
            });

            console.log('Đăng ký thành công:', response.data);
            alert('Đăng ký thành công');
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            setError('Đã xảy ra lỗi, vui lòng thử lại.');

        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Gửi yêu cầu đăng nhập tới backend
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.accesstoken);
            localStorage.setItem('userId', response.data.id);
            console.log('Đăng nhập thành công:', response.data);
            if(response.data.userType == "user"){
                navigate('/ApplicantHome'); // Điều hướng đến trang Job-Board
            } else if(response.data.userType == "manager"){
                navigate('/Job-BoardMain'); // Điều hướng đến trang Job-Board

            } else {
                navigate('/admin'); // Điều hướng đến trang Job-Board
            }

            // navigate('/RecruiterHome'); // Điều hướng đến trang Job-Board

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setError('Thông tin đăng nhập không chính xác.');
            alert('Email hoặc mật khẩu không chính xác!');
        }
    };

    return (

        <div>

            <div className="site-wrap">
                {/* Navbar */}
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

                                    <Link to="/login-1"
                                          className="btn btn-primary border-width-2 d-none d-lg-inline-block">

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
                {/* Hero Section */}
                <section className="section-hero overlay inner-page bg-image"
                         style={{backgroundImage: `url(${require('../../images/hero_1.jpg')})`}} id="home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Sign Up/Login</h1>
                                <div className="custom-breadcrumbs">
                                    <a href="#">Home</a> <span className="mx-2 slash">/</span>
                                    <span className="text-white"><strong>Log In</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SignUp/Login Forms */}
                <section className="site-section">
                    <div className="container">

                        {/* Sign Up Form */}


                        {/* Log In Form */}
                        <div className="col-lg-6" >
                            <Helmet>
                                <style>
                                    {
                                        `
                .col-lg-6 {
        
        margin-left: 282px;
        padding-bottom:50px;
    }
            `
                                    }
                                </style>
                            </Helmet>

                            <h2 className="mb-4">Log In To JobBoard</h2>
                            <form onSubmit={handleLoginSubmit} className="p-4 border rounded">
                                <div className="row form-group">
                                    <div className="col-md-12 mb-3 mb-md-0">
                                        <label className="text-black" htmlFor="email">Email</label>
                                        <input required
                                               type="email"
                                               id="email"
                                               className="form-control"
                                               placeholder="Email address"
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row form-group mb-4">
                                    <div className="col-md-12 mb-3 mb-md-0">
                                        <label className="text-black" htmlFor="password">Password</label>
                                        <input required
                                               type="password"
                                               id="password"
                                               className="form-control"
                                               placeholder="Password"
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <input
                                            type="submit"
                                            value="Log In"
                                            className="btn px-4 btn-primary text-white"
                                        />
                                    </div>
                                </div>

                                <Link  to="/sign-up1">Don't have account?</Link>
                            </form>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default SignUpLogin;
