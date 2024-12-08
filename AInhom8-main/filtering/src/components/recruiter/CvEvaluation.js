import React, { useState } from "react";
import axios from "axios";

const CvEvaluation = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEvaluateAll = async () => {
        setLoading(true);
        setError(null); // Reset error

        try {
            console.log("Đang gọi API để đánh giá tất cả các CV...");
            const response = await axios.post('http://localhost:3000/api/evaluate_all_cvs'); // Đảm bảo API của bạn có sẵn tại endpoint này
            console.log("Phản hồi từ API:", response.data);  // Log phản hồi từ API

            const evaluations = response.data.evaluations;
            setEvaluations(evaluations);
        } catch (err) {
            console.error('Lỗi khi gọi API:', err);
            setError('Có lỗi xảy ra khi đánh giá CVs.');
            if (err.response) {
                console.error('Chi tiết lỗi từ server:', err.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Đánh giá tất cả các CV</h1>

            <button className="btn" onClick={handleEvaluateAll} disabled={loading}>
                {loading ? 'Đang đánh giá...' : 'Đánh giá tất cả CV'}
            </button>

            {error && <p className="error">{error}</p>}

            <div className="results-container">
                {evaluations.length === 0 ? (
                    <p>Chưa có kết quả đánh giá.</p>
                ) : (
                    evaluations.map((result, index) => (
                        <div key={index} className="result-item">
                            <h3>{result.name}</h3>
                            <p><strong>Kết quả đánh giá:</strong> {result.evaluation_result}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CvEvaluation;
