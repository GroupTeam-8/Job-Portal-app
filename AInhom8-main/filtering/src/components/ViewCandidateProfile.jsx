import React, { useState } from 'react';
import '../styles/CandidateProfile.css'; // Tạo file CSS riêng nếu cần
import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios

const CandidateProfile = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState(null);
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null); // Dùng để lưu trữ thông tin cá nhân

    const handleSaveChanges = async (event) => {
        event.preventDefault(); // Ngăn chặn việc reload trang

        // Kiểm tra dữ liệu
        if (!fullName || !email || !picture || !experience || !education) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('profilePicture', picture);
        formData.append('workExperience', experience);
        formData.append('education', education);

        try {
            const response = await axios.post('http://localhost:3001/api/candidate-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Lưu thành công');
            // Cập nhật dữ liệu hồ sơ
            setProfileData({
                fullName,
                email,
                profilePicture: response.data.profilePicture || picture.name, // Thay thế bằng tên file hoặc đường dẫn nếu có
                workExperience: experience,
                education
            });
            setIsEditing(false); // Đổi trạng thái hiển thị
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert('Lưu không thành công');
        }
    };

    return (
        <div className="container">
            <h2>Hồ Sơ Ứng Viên</h2>
            {isEditing ? (
                <form onSubmit={handleSaveChanges}>
                    <div className="form-group">
                        <label htmlFor="full-name">Họ Tên:</label>
                        <input type="text" id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nhập họ tên" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Địa Chỉ Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập địa chỉ email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profile-picture">Tải Lên Hình Ảnh Hồ Sơ:</label>
                        <input type="file" id="profile-picture" onChange={(e) => setPicture(e.target.files[0])} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="work-experience">Kinh Nghiệm Làm Việc:</label>
                        <textarea id="work-experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Chi tiết kinh nghiệm làm việc"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="education">Học Vấn:</label>
                        <textarea id="education" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Chi tiết học vấn"></textarea>
                    </div>

                    <div className="button-container">
                        <button className="button" type="submit">Lưu Thay Đổi</button>
                        <button className="button cancel" type="button" onClick={() => setIsEditing(false)}>Hủy</button>
                    </div>
                </form>
            ) : (
                <div className="profile-info">
                    {profileData ? (
                        <>
                            <p><strong>Họ Tên:</strong> {profileData.fullName}</p>
                            <p><strong>Email:</strong> {profileData.email}</p>
                            <p><strong>Kinh Nghiệm Làm Việc:</strong> {profileData.workExperience}</p>
                            <p><strong>Học Vấn:</strong> {profileData.education}</p>
                            {profileData.profilePicture && (
                                <img src={profileData.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} /> // Hiển thị ảnh nếu có
                            )}
                            <button className="button" onClick={() => setIsEditing(true)}>Chỉnh Sửa</button>
                        </>
                    ) : (
                        <p>Chưa có thông tin cá nhân.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CandidateProfile;
