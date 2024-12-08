import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/CandidateSearch.css';
import Helmet from "react-helmet"; // Đường dẫn đến file CSS

const CandidateSearch = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [experienceTerm, setExperienceTerm] = useState(''); // Tìm kiếm theo kinh nghiệm làm việc
    const [educationTerm, setEducationTerm] = useState(''); // Tìm kiếm theo học vấn

    // Hàm để lấy danh sách ứng viên từ API
    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/candidates'); // Thay đổi URL nếu cần
            setCandidates(response.data);
        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy danh sách ứng viên:', error);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Hàm để xử lý tìm kiếm theo tên
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm để xử lý tìm kiếm theo kinh nghiệm làm việc
    const handleExperienceSearch = (event) => {
        setExperienceTerm(event.target.value);
    };

    // Hàm để xử lý tìm kiếm theo học vấn
    const handleEducationSearch = (event) => {
        setEducationTerm(event.target.value);
    };

    // Lọc danh sách ứng viên theo các tiêu chí: tên, kinh nghiệm làm việc, học vấn
    const filteredCandidates = candidates.filter(candidate =>
        candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        candidate.work_experience.toLowerCase().includes(experienceTerm.toLowerCase()) &&
        candidate.education.toLowerCase().includes(educationTerm.toLowerCase())
    );

    return (
        <div className="candidate-search">
            <Helmet>
                <style>
                    {
                        `
                        /* src/styles/CandidateSearch.css */
.candidate-search {
    padding: 20px;
}

.candidate-search h2 {
    margin-bottom: 20px;
}

.candidate-search input {
    padding: 10px;
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.candidate-search ul {
    list-style-type: none;
    padding: 0;
}

.candidate-search li {
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
}

                        `
                    }
                </style>
            </Helmet>
            <h2>Tìm Kiếm Ứng Viên</h2>

            {/* Tìm kiếm theo tên */}
            <input
                type="text"
                placeholder="Nhập tên ứng viên..."
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Tìm kiếm theo kinh nghiệm làm việc */}
            <input
                type="text"
                placeholder="Nhập kinh nghiệm làm việc..."
                value={experienceTerm}
                onChange={handleExperienceSearch}
            />

            {/* Tìm kiếm theo học vấn */}
            <input
                type="text"
                placeholder="Nhập học vấn..."
                value={educationTerm}
                onChange={handleEducationSearch}
            />

            {/* Hiển thị danh sách ứng viên đã lọc */}
            {filteredCandidates.length > 0 ? (
                <ul>
                    {filteredCandidates.map(candidate => (
                        <li key={candidate.id}>
                            <h3>{candidate.full_name}</h3>
                            <p>Email: {candidate.email}</p>
                            <p>Kinh Nghiệm: {candidate.work_experience}</p>
                            <p>Học Vấn: {candidate.education}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không tìm thấy ứng viên nào.</p>
            )}
        </div>
    );
};

export default CandidateSearch;
