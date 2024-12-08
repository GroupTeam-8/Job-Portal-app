import React, { useState } from 'react';
import Helmet from "react-helmet";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(false);

        // Kiểm tra nếu chưa đăng nhập
        if (!userId) {
            setMessage('Bạn cần đăng nhập trước khi thay đổi mật khẩu.');
            setError(true);
            return;
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu mới không khớp!');
            setError(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Đổi mật khẩu thành công!');
                setError(false);
                // Reset form fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
                setError(true);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('Lỗi kết nối với server');
            setError(true);
        }
    };

    return (
        <div className="container">
            <Helmet>
                <style>
                    {`
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }

                    .container {
                        background-color: white;
                        padding: 30px;
                        max-width: 400px;
                        width: 100%;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                    }

                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                        font-size: 24px;
                        color: #333;
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                    }

                    label {
                        margin-bottom: 5px;
                        color: #555;
                    }

                    input[type="password"] {
                        padding: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 16px;
                    }

                    button {
                        background-color: #28a745;
                        color: white;
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }

                    button:hover {
                        background-color: #218838;
                    }

                    p {
                        text-align: center;
                        margin-top: 20px;
                        color: red;
                    }

                    .success-message {
                        text-align: center;
                        margin-top: 20px;
                        color: green;
                    }

                    @media (max-width: 768px) {
                        .container {
                            padding: 15px;
                        }

                        h2 {
                            font-size: 20px;
                        }

                        input[type="password"] {
                            font-size: 14px;
                        }

                        button {
                            font-size: 14px;
                        }
                    }
                    `}
                </style>
            </Helmet>

            <h2>Thay đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword}>
                <div>
                    <label>Mật khẩu hiện tại:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Xác nhận mật khẩu mới:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đổi mật khẩu</button>
            </form>
            {message && <p className={error ? 'error-message' : 'success-message'}>{message}</p>}
        </div>
    );
};

export default ChangePassword;
