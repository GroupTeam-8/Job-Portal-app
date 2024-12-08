import React from 'react';
import { IonIcon } from '@ionic/react';
import { logoApple } from 'ionicons/icons';
import { menuOutline, searchOutline,homeOutline,peopleOutline,chatboxOutline,briefcaseOutline,documentTextOutline,logInOutline,personCircleOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
function Navigation() {
    const navigate = useNavigate(); // useNavigate hook
    const handleLogout = () => {
        // Xóa thông tin đăng nhập (ví dụ: token hoặc sessionStorage)
        localStorage.removeItem('userToken'); // Hoặc sessionStorage.removeItem('userToken')

        // Chuyển hướng về trang đăng nhập hoặc trang chính
        navigate('/'); // Sử dụng navigate để chuyển hướng
    };
    return (
        <div className="navigation">
            <ul>
                <li>
                    <a href="#">
            <span className="icon">
            <IonIcon icon={personCircleOutline}/>

            </span>
                        <span className="title">Admin</span>
                    </a>
                </li>
                {/* Repeat list items */}
                <li>
                    <a href="/admin">
                   <span className="icon">
                       <IonIcon icon={homeOutline}/>
                   </span>
                        <span className="title">Dashboard</span>
                    </a>
                </li>

                <li>
                    <a href="/user">
                   <span className="icon">
                       <IonIcon icon={peopleOutline}/>
                   </span>
                        <span className="title">Users</span>
                    </a>
                </li>
                <li>
                    <a href="/comment">
                   <span className="icon">
                       <IonIcon icon={chatboxOutline}/>
                   </span>
                        <span className="title">Comment</span>
                    </a>
                </li>
                <li>
                    <a href="/job">
                   <span className="icon">
                       <IonIcon icon={briefcaseOutline}/>
                   </span>
                        <span className="title">Job</span>
                    </a>
                </li>

                <li>
                    <a href="/applications">
                   <span className="icon">
                       <IonIcon icon={documentTextOutline}/>
                   </span>
                        <span className="title">Applications</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={handleLogout}>
                        <span className="icon">
                            <IonIcon icon={logInOutline}/>
                        </span>
                        <span className="title">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Navigation;
