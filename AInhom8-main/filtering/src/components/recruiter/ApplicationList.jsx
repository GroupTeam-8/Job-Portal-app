import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ApplicationList = () => {
    const { jobId } = useParams(); // Lấy jobId từ URL
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                console.log("Job ID từ URL:", jobId);
                const response = await fetch(`http://localhost:3001/api/applicants`); // Lấy tất cả ứng viên
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy danh sách ứng viên');
                }
                const data = await response.json();
                console.log('Dữ liệu ứng viên:', data);

                // Lọc ứng viên có job_id trùng với jobId trong URL
                // Lọc ứng viên có job_id trùng với jobId trong URL

            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu ứng viên:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]); // Gọi lại API mỗi khi jobId thay đổi

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error}</p>;
    }

    return (
        <div>
            <h1>Danh Sách Ứng Viên</h1>
            <ul>
                {applicants.length > 0 ? (
                    applicants.map(applicant => (
                        <li key={applicant.id}>
                            <p><strong>Họ tên:</strong> {applicant.name}</p>
                            <p><strong>Vị trí công việc:</strong> {applicant.job_title}</p>
                            <p><strong>Kinh nghiệm:</strong> {applicant.experience}</p>
                            <p><strong>Trạng thái:</strong> {applicant.status}</p>
                        </li>
                    ))
                ) : (
                    <p>Không có ứng viên nào cho công việc này.</p>
                )}
            </ul>
        </div>
    );
};

export default ApplicationList;
