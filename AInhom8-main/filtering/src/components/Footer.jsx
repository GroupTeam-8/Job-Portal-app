import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <a href="#top" className="smoothscroll scroll-top">
                <span className="fa-solid fa-chevron-up"></span>
            </a>

            <div className="container">
                <div className="row mb-5">
                    <div className="col-6 col-md-3 mb-4 mb-md-0">

                        <a><img style={{maxWidth:"200px"}}
                            src="https://cdn-icons-png.flaticon.com/512/6427/6427283.png"
                            alt="" className="img-fluid logo-footer"/></a>

                    </div>

                    <div className="col-6 col-md-3 mb-4 mb-md-0">
                        <h3>Useful Links</h3>
                        <ul className="list-unstyled">

                            <li><a href="/Post-Job">Post job</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">AI filtering</a></li>

                        </ul>
                    </div>

                    <div className="col-6 col-md-3 mb-4 mb-md-0">
                        <h3>Address</h3>
                        <ul className="list-unstyled">
                            <li style={{color: "white"}}>Tòa D, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội
                            </li>
                            <li style={{color: "white"}}>Nhom8@gmail.com</li>
                            <li style={{color: "white"}}>0393109390</li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-3 mb-4 mb-md-0">
                        <h3>Contact Us</h3>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/profile.php?id=61570183013854"><span className="icon-facebook"></span></a>
                            <a href="#"><span className="icon-twitter"></span></a>
                            <a href="#"><span className="icon-instagram"></span></a>
                            <a href="#"><span className="icon-linkedin"></span></a>
                        </div>
                    </div>
                </div>

                <div className="row text-center">
                    <div className="col-12">

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
