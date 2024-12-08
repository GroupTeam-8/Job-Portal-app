const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Cấu hình kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name',
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối đến cơ sở dữ liệu:', err);
        return;
    }
    console.log('Kết nối đến cơ sở dữ liệu thành công!');
});

// Cấu hình Nodemailer để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

// Hàm gửi email xác minh
function sendVerificationEmail(fullname, email, verificationCode) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Xác Nhận Địa Chỉ Email',
            text: `Chào ${fullname},\n\nMã xác nhận của bạn là: ${verificationCode}\n\nVui lòng nhập mã xác nhận trên ứng dụng để hoàn tất đăng ký.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
}

// Endpoint đăng ký
app.post('/register', (req, res) => {
    const { fullname, email, password, user_type } = req.body;

    // Kiểm tra định dạng email
    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Vui lòng sử dụng địa chỉ Gmail hợp lệ' });
    }

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            console.error('Lỗi khi kiểm tra email:', err);
            return res.status(500).json({ message: 'Đăng ký thất bại' });
        }

        // Kiểm tra nếu email đã tồn tại
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại. Vui lòng sử dụng email khác.' });
        }

        // Tạo mã xác minh
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu mã xác minh vào cơ sở dữ liệu
        const sqlInsertCode = 'INSERT INTO email_verifications (email, code) VALUES (?, ?)';
        db.query(sqlInsertCode, [email, verificationCode], (err) => {
            if (err) {
                console.error('Lỗi khi lưu mã xác minh:', err);
                return res.status(500).json({ message: 'Đăng ký thất bại' });
            }

            // Gửi email xác minh
            sendVerificationEmail(fullname, email, verificationCode)
                .then(() => {
                    return res.status(200).json({ message: 'Đăng ký thành công, kiểm tra email để xác thực!' });
                })
                .catch((error) => {
                    console.error('Lỗi khi gửi email:', error);
                    return res.status(500).json({ message: 'Không thể gửi email xác thực' });
                });
        });
    });
});

// Endpoint xác minh email
app.post('/verify-email', (req, res) => {
    const { email, code } = req.body;

    // Kiểm tra mã xác minh
    const checkCodeSql = 'SELECT * FROM email_verifications WHERE email = ? AND code = ?';
    db.query(checkCodeSql, [email, code], (err, results) => {
        if (err) {
            console.error('Lỗi khi kiểm tra mã xác minh:', err);
            return res.status(500).json({ message: 'Lỗi server' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' });
        }

        // Xóa mã xác minh sau khi xác minh thành công
        const deleteCodeSql = 'DELETE FROM email_verifications WHERE email = ?';
        db.query(deleteCodeSql, [email], (err) => {
            if (err) {
                console.error('Lỗi khi xóa mã xác minh:', err);
                return res.status(500).json({ message: 'Lỗi server' });
            }

            return res.status(200).json({ message: 'Xác minh email thành công!' });
        });
    });
});

// Khởi động server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
