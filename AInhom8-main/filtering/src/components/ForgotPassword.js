import React, { useState } from 'react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email input, 2: Verification code, 3: New password
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const sendVerificationCode = async () => {
        // Gửi yêu cầu đến backend để gửi mã xác minh
        // Thay thế URL và logic tương ứng ở đây
        alert(`A verification code has been sent to ${email}`);
        setStep(2); // Chuyển sang bước xác minh
    };

    const verifyCode = () => {
        // Logic kiểm tra mã xác minh
        alert(`Verification code ${verificationCode} is correct.`);
        setStep(3); // Chuyển sang bước đặt lại mật khẩu
    };

    const resetPassword = async () => {
        if (newPassword === confirmPassword) {
            // Gửi yêu cầu đến backend để đặt lại mật khẩu
            alert(`Your password has been reset successfully.`);
            // Chuyển hướng đến trang đăng nhập
            window.location.href = '/login';
        } else {
            alert("Passwords do not match. Please try again.");
        }
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>

            {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); sendVerificationCode(); }}>
                    <label htmlFor="email">Email Address:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit" className="button">Reset Password</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); verifyCode(); }}>
                    <label htmlFor="verificationCode">Verification Code:</label>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                    <button type="submit" className="button">Verify Code</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                    <label htmlFor="newPassword">New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="submit" className="button">Set New Password</button>
                </form>
            )}

            <div className="link">
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
};

export default ForgotPassword;
