import React, { useState } from "react";
import axios from "axios";

const UploadCV = () => {
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("cvFile", file);

        try {
            const response = await axios.post("http://localhost:3001/api/cv/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFeedback(response.data.feedback);
        } catch (error) {
            console.error("Error uploading CV:", error);
        }
    };

    return (
        <div>
            <h2>Upload Your CV</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {feedback && (
                <div>
                    <h3>Feedback:</h3>
                    <p>{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default UploadCV;
