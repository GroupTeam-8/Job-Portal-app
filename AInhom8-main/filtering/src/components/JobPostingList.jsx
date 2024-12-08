import React, { useState, useEffect } from 'react';
import '../styles/JobPostingList.css'; // Đảm bảo tạo file CSS nếu cần
import JobPostingModal from './JobPostingModal';
import Helmet from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const JobPostingList = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [jobPostings, setJobPostings] = useState([]); // State để lưu danh sách job postings
    const [editingJob, setEditingJob] = useState(null); // State để lưu job posting đang chỉnh sửa
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Hàm để gọi API và lấy job postings
    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await fetch('http://localhost:3001/job-postings');
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu');
                }
                const data = await response.json();
                setJobPostings(data); // Cập nhật state với dữ liệu lấy được
                // console.log('Job Postings:', data); // Kiểm tra dữ liệu
            } catch (error) {
                console.error('Lỗi khi lấy job postings:', error);
            }
        };

        fetchJobPostings();
    }, []); // [] để chỉ chạy một lần khi component được mount

    const openModal = () => {
        setEditingJob(null); // Reset editingJob khi mở modal
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setEditingJob(null); // Reset editingJob khi đóng modal
    };

    const handleAddJobPosting = (newJobPosting) => {
        setJobPostings((prevPostings) => {
            if (editingJob) {
                // Cập nhật job posting nếu đang ở chế độ chỉnh sửa
                const updatedPostings = [...prevPostings];
                updatedPostings[prevPostings.indexOf(editingJob)] = newJobPosting;
                return updatedPostings;
            } else {
                // Thêm job posting mới vào danh sách
                return [...prevPostings, newJobPosting];
            }
        });
        closeModal(); // Đóng modal sau khi lưu
    };

    const handleEdit = (jobId) => {
        console.log("Job ID là :", jobId);
        const jobToEdit = jobPostings.find(job => job.id === jobId);
        setEditingJob(jobToEdit);  // Truyền job này vào modal để chỉnh sửa
        setModalIsOpen(true);  // Mở modal
    };

    const handleDeleteJobPosting = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:3001/job-postings/${jobId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Lỗi khi xóa job posting');
            }

            // Xóa job khỏi danh sách dựa trên jobId
            const updatedPostings = jobPostings.filter(job => job.id !== jobId);
            setJobPostings(updatedPostings);
        } catch (error) {
            console.error('Lỗi khi xóa job posting:', error);
        }
    };



    const filteredJobPostings = jobPostings.filter(job => {
        const isTitleMatch = job.job_title && typeof job.job_title === 'string' && job.job_title.toLowerCase().includes(searchTerm.toLowerCase());
        const isStatusMatch = filterStatus === '' ||
            (filterStatus === 'active' && job.expiryDate && new Date(job.expiryDate) > new Date()) ||
            (filterStatus === 'expired' && job.expiryDate && new Date(job.expiryDate) <= new Date());

        // Kiểm tra lại các giá trị điều kiện lọc trong console
        // console.log('Job:', job);
        // console.log('Title match:', isTitleMatch, 'Status match:', isStatusMatch);

        return isTitleMatch && isStatusMatch;
    });


    return (
        <div className="container">
            <Helmet>
                <style>{`
        /* src/components/JobPostingList.css */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    justify-content: center;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
}

.button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
}

.button:hover {
    background-color: #0056b3;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

table, th, td {
    border: 1px solid #ddd;
}

th, td {
    padding: 10px;
    text-align: left;
}

th {
    background-color: #007BFF;
    color: white;
}

.actions {
    display: flex;
    justify-content: space-around;
}

.search-bar, .filter-bar {
    margin-bottom: 20px;
}

.filter-bar select, .search-bar input {
    padding: 10px;
    width: calc(100% - 20px);
}

        `}</style>
            </Helmet>
            <h2>Job Posting List</h2>
            <button style={{backgroundColor:"green"}} onClick={openModal} className="button">Create New Job Posting</button>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Job Title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="filter-bar">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Filter by Status</option>
                    <option value="active">Active</option>
                    <option value="Expired">Expired</option>
                </select>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Job Title</th>
                    <th>Posted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredJobPostings.map((job, index) => (
                    <tr key={index}>
                        {console.log(job)} {/* Kiểm tra nội dung của job */}
                        <td>{job.job_title}</td>

                        {/* Chuyển đổi posted_date thành dạng hiển thị */}
                        <td>{job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}</td>

                        {/* Hiển thị trạng thái công việc dựa trên expiryDate */}
                        <td>{new Date(job.expiry_date) > new Date() ? 'Active' : 'Expired'}</td>

                        <td className="actions">
                            <a href="#" onClick={() => handleEdit(job.id)}> {/* Truyền job.id thay vì index */}
                                <FontAwesomeIcon icon={faEdit} style={{color: "blue", cursor: "pointer"}}/>
                            </a>
                            <a href="#" onClick={() => handleDeleteJobPosting(job.id)}> {/* Truyền job.id để xóa */}
                                <FontAwesomeIcon icon={faTrash} style={{color: "red", cursor: "pointer"}}/>
                            </a>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>

            <JobPostingModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onAddJobPosting={handleAddJobPosting}
                editingJob={editingJob} // Truyền thông tin job đang chỉnh sửa vào modal
            />
        </div>
    );
}
export default JobPostingList;