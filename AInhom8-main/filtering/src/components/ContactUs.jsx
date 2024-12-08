
import Footer from "./Footer";

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
const ContactUs = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
    });
    console.log()

    const [messages, setMessages] = useState([]);

    // Lấy danh sách tin nhắn khi tải trang
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get("http://localhost:3001/messages");
            setMessages(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tin nhắn:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/messages", formData);
            alert("Tin nhắn đã được gửi thành công!");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
            });
            fetchMessages(); // Cập nhật danh sách tin nhắn
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            alert("Đã xảy ra lỗi khi gửi tin nhắn.");
        }
    };
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
        <>
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
            <section
                className="section-hero overlay inner-page bg-image"
                style={{backgroundImage: `url(${require('../images/hero_1.jpg')})`}}
                id="home-section"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <h1 className="text-white font-weight-bold">Contact Us</h1>
                            <div className="custom-breadcrumbs">
                                <a href="#">Home</a>
                                <span className="mx-2 slash">/</span>
                                <span className="text-white">
                  <strong>Contact Us</strong>
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="site-section" id="next-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <form onSubmit={handleSubmit}>
                                <div className="row form-group">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="text-black" htmlFor="fname">First Name</label>
                                        <input
                                            type="text"
                                            id="fname"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-black" htmlFor="lname">Last Name</label>
                                        <input
                                            type="text"
                                            id="lname"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <label className="text-black" htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <label className="text-black" htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <label className="text-black" htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            cols="30"
                                            rows="7"
                                            className="form-control"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <input type="submit" value="Send Message"
                                               className="btn btn-primary btn-md text-white"/>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="col-lg-5 ml-auto">
                            <div className="p-4 mb-3 bg-white">
                                <p className="mb-0 font-weight-bold">Address</p>
                                <p className="mb-4">
                                    Tòa D, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội
                                </p>

                                <p className="mb-0 font-weight-bold">Phone</p>
                                <p className="mb-4">
                                    <a href="#">0393109390</a>
                                </p>

                                <p className="mb-0 font-weight-bold">Email Address</p>
                                <p className="mb-0">
                                    <a href="#">nhom8@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="site-section bg-light">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12 text-center" data-aos="fade">
                            <h2 className="section-title mb-3">Happy Candidates Say</h2>
                        </div>
                    </div>
                    <div className="row">
                        {messages.map((msg) => (
                            <div className="col-lg-6" key={msg.id}>
                                <div className="block__87154 bg-white rounded">
                                    <blockquote>
                                        <p>
                                            &ldquo;{msg.message}&rdquo;
                                        </p>
                                    </blockquote>
                                    <div className="block__91147 d-flex align-items-center">
                                        <div>
                                            <h3>{msg.last_name}</h3>
                                            <span className="position">{msg.subject}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer/>
        </>
    );
};

export default ContactUs;
