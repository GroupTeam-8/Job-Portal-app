import React, { useEffect, useState } from 'react';
import Navigation from './Navigation'; // Import Navigation component
import TopBar from './TopBar';         // Import TopBar component
import axios from 'axios'; // Import Axios để thực hiện các yêu cầu HTTP

const Applications = () => {
    const [applications, setApplications] = useState([]);

    // Lấy danh sách đơn ứng tuyển từ backend
    useEffect(() => {
        axios.get('http://localhost:3001/applications')  // Gọi API GET để lấy dữ liệu đơn ứng tuyển
            .then(response => {
                setApplications(response.data);  // Lưu dữ liệu vào state applications

            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu đơn ứng tuyển:', error);
            });
    }, []);

    // Xóa đơn ứng tuyển
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/applications/${id}`)  // Gọi API DELETE để xóa đơn ứng tuyển
            .then(response => {
                alert(response.data.message);  // Thông báo xóa thành công
                setApplications(applications.filter(app => app.id !== id)); // Xóa đơn ứng tuyển khỏi state
            })
            .catch(error => {
                console.error('Lỗi khi xóa đơn ứng tuyển:', error);
                alert('Xóa đơn ứng tuyển thất bại.');
            });
    };

    // Chỉnh sửa đơn ứng tuyển
    const handleEdit = (application) => {
        const newName = prompt('Nhập tên mới:', application.name);
        const newEmail = prompt('Nhập email mới:', application.email);
        const newCoverLetter = prompt('Nhập thư xin việc mới:', application.cover_letter);
        const newStatus = prompt('Nhập trạng thái mới:', application.status);

        if (newName && newEmail && newCoverLetter && newStatus) {
            axios.put(`http://localhost:3001/applications/${application.id}`, {
                name: newName,
                email: newEmail,
                cover_letter: newCoverLetter,
                status: newStatus
            })
                .then(response => {
                    alert(response.data.message);  // Thông báo cập nhật thành công
                    setApplications(applications.map(app => app.id === application.id ? {
                        ...app,
                        name: newName,
                        email: newEmail,
                        cover_letter: newCoverLetter,
                        status: newStatus
                    } : app)); // Cập nhật lại dữ liệu trong state
                })
                .catch(error => {
                    console.error('Lỗi khi cập nhật đơn ứng tuyển:', error);
                    alert('Cập nhật đơn ứng tuyển thất bại.');
                });
        }
    };

    return (
        <div>
            {/* Navigation Section */}
            <Navigation />

            {/* Main Content */}
            <div className="main">
                {/* TopBar Section */}


                {/* Details Section */}
                <div style={{justifyContent:"center",alignItems:"center",display:"flex"}} className="details">
                    <div className="recentOrders">
                        <div className="cardHeader">
                            <h2>Applications</h2>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <td>CV</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Cover Letter</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {applications.map((application, index) => (
                                console.log(`CV URL: http://localhost:3001/${application.cv}`),

                                <tr key={index}>

                                    <td>
                                        <iframe
                                            src={`http://localhost:3001/${application.cv}`}  // Đảm bảo rằng đường dẫn đầy đủ
                                            width="100%"
                                            height="250px"  // Đặt chiều cao tùy chỉnh
                                            title="PDF Viewer"
                                            style={{border: "none"}}
                                        >
                                        </iframe>
                                    </td>

                                    <td>{application.name}</td>
                                    <td>{application.email}</td>
                                    <td>{application.cover_letter}</td>
                                    <td>{application.status}</td>
                                    <td>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleEdit(application)}
                                                    className="btn btn-success btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top" title="Edit">
                                                <i className="fa fa-edit"></i>
                                            </button>
                                        </li>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleDelete(application.id)}
                                                    className="btn btn-danger btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top" title="Delete">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </li>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Applications;
