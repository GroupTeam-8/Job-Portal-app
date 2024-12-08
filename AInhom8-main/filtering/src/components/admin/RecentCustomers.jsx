import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecentCustomers() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // Fetch application data from the server
        axios.get('http://localhost:3001/applications') // Đảm bảo đúng URL server của bạn
            .then(response => {
                setApplications(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách applications:', error);
            });
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'blue';  // Màu cam cho "pending"
            case 'rejected':
                return 'red';     // Màu đỏ cho "rejected"
            case 'accepted':
                return 'green';   // Màu xanh cho "accepted"
            default:
                return 'gray';    // Màu mặc định
        }
    };
    return (
        <div className="recentCustomers">
            <div className="cardHeader">
                <h2>Recent Applications</h2>
            </div>
            <table style={{borderCollapse: "collapse", width: "100%"}}>
                <tbody>
                {applications.map((application, index) => (
                    <tr key={index} style={{borderBottom: "1px solid #ddd"}}>
                        <td>
                            <h4>
                                {application.name} <br/>
                                <span style={{color: getStatusColor(application.status)}}>
                            Status: {application.status}
                        </span>
                            </h4>
                        </td>
                        <td style={{fontSize: "14px"}}>
                            {application.email}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

export default RecentCustomers;
