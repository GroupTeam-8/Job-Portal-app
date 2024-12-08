require('dotenv').config(); // Để sử dụng biến môi trường từ file .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const pdfParse = require('pdf-parse');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('./config')

// Tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cấu hình MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Kết nối tới MySQL
db.connect((err) => {
    if (err) {
        console.error('Không thể kết nối đến MySQL:', err);
        return;
    }
    console.log('Đã kết nối đến MySQL');
});

// Tạo transporter cho Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách users:', err);
            return res.status(500).json({ message: 'Lấy danh sách thất bại' });
        }
        // Trả về danh sách người dùng
        return res.status(200).json(results);
    });
});
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi xóa user:', err);
            return res.status(500).json({ message: 'Xóa người dùng thất bại' });
        }
        return res.status(200).json({ message: 'Xóa người dùng thành công' });
    });
});
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { email, password, usertype } = req.body;

    const sql = 'UPDATE users SET email = ?, password = ?, usertype = ? WHERE id = ?';

    db.query(sql, [email, password, usertype, id], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật user:', err);
            return res.status(500).json({ message: 'Cập nhật người dùng thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật người dùng thành công' });
    });
});
app.get('/messages', (req, res) => {
    const sql = 'SELECT * FROM messages';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách messages:', err);
            return res.status(500).json({ message: 'Lấy danh sách thất bại' });
        }
        // Trả về danh sách người dùng
        return res.status(200).json(results);
    });
});
app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM messages WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi xóa user:', err);
            return res.status(500).json({ message: 'Xóa bình luận thất bại' });
        }
        return res.status(200).json({ message: 'Xóa bình luận thành công' });
    });
});
app.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, subject, message } = req.body;

    const sql = 'UPDATE messages SET first_name = ?, last_name = ?, email = ?, subject = ?, message = ? WHERE id = ?';

    db.query(sql, [firstname, lastname, email, subject, message, id], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật user:', err);
            return res.status(500).json({ message: 'Cập nhật bình luận thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật bình luận thành công' });
    });
});
app.post('/update-application-status', (req, res) => {
    const { id, status } = req.body;

    console.log('Received ID:', id); // Log ID
    console.log('Received Status:', status); // Log Status

    if (!id || !status) {
        console.error('Missing ID or Status');
        return res.status(400).json({ message: 'ID hoặc Status bị thiếu' });
    }

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (error, results) => {
        if (error) {
            console.error('Database error:', error); // Log lỗi DB
            return res.status(500).json({ message: 'Lỗi cơ sở dữ liệu' });
        }

        if (results.affectedRows === 0) {
            console.warn('Không tìm thấy ứng viên với ID:', id); // Log nếu không tìm thấy ứng viên
            return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
        }

        console.log('Cập nhật thành công ID:', id, 'với trạng thái:', status);
        res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    });
});

app.post("/send-email", async (req, res) => {
    const { toEmail, applicantName, feedbackContent,company } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Thay đổi nếu bạn dùng dịch vụ SMTP khác
            auth: {
                user: "quyetprime1234@gmail.com", // Email của bạn
                pass: "nkjy qcgh wcjf vdlu",   // App Password nếu dùng Gmail
            },
        });

        const mailOptions = {
            from: "quyetprime1234@gmail.com",
            to: toEmail, // Email ứng viên
            subject: "Feedback for Your Application",
            text: `Dear ${applicantName},\n\n${feedbackContent}\n\nBest regards`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
});
// API đăng ký
app.post('/signup', (req, res) => {
    const { email, password, usertype } = req.body; // Nhận thêm usertype
    const query = 'INSERT INTO users (email, password, usertype) VALUES (?, ?, ?)';

    db.query(query, [email, password, usertype], (err, result) => {
        if (err) {
            console.error('Lỗi đăng ký:', err);
            res.status(500).send('Lỗi đăng ký');
            return;
        }
        res.status(200).send('Đăng ký thành công');
    });
});

// API đăng nhập
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
//
//     db.query(query, [email, password], (err, result) => {
//         if (err) {
//             res.status(500).send('Lỗi đăng nhập');
//             return;
//         }
//         if (result.length > 0) {
//             res.status(200).send('Đăng nhập thành công');
//         } else {
//             res.status(401).send('Thông tin đăng nhập không chính xác');
//             // alert('Email hoặc mật khẩu không chính xác!')
//         }
//     });
// });
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            res.status(500).send('Lỗi đăng nhập');
            return;
        }
        if (result.length > 0) {
            const accessToken = jwt.sign(
                {userId: result[0].id},config.accessTokenSecret, {subject: 'accessApi',expiresIn: '1d'})
            res.status(200).json({
                id: result[0].id,
                name: result[0].fullname,
                email: result[0].email,
                accesstoken: accessToken,
                userType:result[0].usertype
            })
        } else {
            res.status(401).send('Thông tin đăng nhập không chính xác');
            // alert('Email hoặc mật khẩu không chính xác!')
        }
    });
});
//cập nhật thêm
app.get('/user', ensureAuthenticated,authorize(['admin','user']), (req,res) => {

    return res.status(200).json({message:"only admin and user can access this route"})
})
app.get('/admin', ensureAuthenticated,authorize(['admin']), (req,res) => {

    return res.status(200).json({message:"only admin can access this route"})
})
app.get('/manager', ensureAuthenticated,authorize(['manager','admin']), (req,res) => {

    return res.status(200).json({message:"only manager and admin can access this route"})
})
function authorize(roles =[]){
    return async function (req,res, next) {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, req.user.id, (err, result) => {
            const user = {
                id: result[0].id,
                name: result[0].fullname,
                email: result[0].email,
                password: result[0].password,
                userType: result[0].usertype
            }
            if(!user || !roles.includes(user.userType)) {
                return res.status(403).json({
                    message: 'Access denied'
                })
            }
            next()
        });
    }

}


app.get('/current',ensureAuthenticated, async(req,res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, req.user.id, (err, result) => {
        try {
            const user = {
                id: result[0].id,
                fullname: result[0].fullName,
                email:result[0].email,
                userType: result[0].usertype
            }
            return res.status(200).json({
                id:user.id,
                name:user.fullname,
                email:user.email,
                userType:user.userType
            })
        } catch {
            return res.status(500).json({
                message:err.message
            })
        }
    });
});
async function ensureAuthenticated(req, res, next) {
    const accessToken = req.headers.authorization

    if(!accessToken) {
        return res.status(401).json({
            message:"Access Token not found"
        })
    }
    try {
        const decodeAccessToken = jwt.verify(accessToken, config.accessTokenSecret)
        req.user = {id: decodeAccessToken.userId}
        next()
    } catch (err) {
        return res.status(401).json({
            message:"Access Token invald or expired"
        })
    }

}

//end








// API để lấy danh sách công việc
app.get('/job_postings', (req, res) => {
    const sql = 'SELECT * FROM job_postings';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách công việc:', err);
            return res.status(500).json({ message: 'Lấy danh sách công việc thất bại' });
        }
        // Trả về danh sách công việc
        return res.status(200).json(results);
    });
});


// DELETE route to delete a job posting by ID
// API để xóa công việc theo ID
app.delete('/job_postings/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM job_postings WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi xóa công việc:', err);
            return res.status(500).json({ message: 'Xóa công việc thất bại' });
        }
        return res.status(200).json({ message: 'Xóa công việc thành công' });
    });
});
// PUT route to update a job posting by ID
// API để cập nhật thông tin công việc theo ID
app.put('/job_postings/:id', (req, res) => {
    const { id } = req.params;
    const { job_title, job_description, required_skills, experience, salary_range, expiry_date, job_type, posted_date, recruiter_id, location, company } = req.body;

    const sql = 'UPDATE job_postings SET job_title = ?, job_description = ?, required_skills = ?, experience = ?, salary_range = ?, expiry_date = ?, job_type = ?, posted_date = ?, recruiter_id = ?, location = ?, company = ? WHERE id = ?';

    db.query(sql, [job_title, job_description, required_skills, experience, salary_range, expiry_date, job_type, posted_date, recruiter_id, location,  company, id], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật công việc:', err);
            return res.status(500).json({ message: 'Cập nhật công việc thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật công việc thành công' });
    });
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Đường dẫn đến thư mục bạn muốn lưu tệp
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Đặt tên cho tệp
    },
});

// API để lấy thông tin công việc
app.get('/job-postings/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    // Truy vấn dữ liệu từ cơ sở dữ liệu
    db.query('SELECT * FROM job_postings WHERE id = ?', [jobId], (err, results) => {
        if (err) {
            console.error('Error fetching job details:', err);
            res.status(500).send('Error fetching job details');
            return;
        }

        if (results.length > 0) {
            // Trả về kết quả nếu tìm thấy công việc
            res.json(results[0]);
        } else {
            // Nếu không tìm thấy công việc
            res.status(404).send('Job not found');
        }
    });
});

//
const uploadd = multer({ storage: multer.memoryStorage() }); // Định nghĩa một bộ nhớ tạm thời
const upload = multer({ storage: storage }); // Chỉ nên định nghĩa một lần
const uploaddd = multer({ storage: storage }); // Chỉ nên định nghĩa một lần
// API để thêm job posting
// API để thêm job posting
app.post('/job-postings', uploaddd.single('file'), (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract JWT from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, config.accessTokenSecret); // Verify and decode token
        const recruiterId = decoded.userId; // Extract `userId` from the token

        const { jobTitle, jobDescription, requiredSkills, experience, salaryRange, expiryDate, jobType, postedDate, jobLocation, company } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save the image path

        // Check for missing fields
        if (!jobTitle || !jobDescription || !requiredSkills || !experience || !salaryRange || !expiryDate || !jobType || !postedDate || !jobLocation || !company) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const sql = `
            INSERT INTO job_postings 
            (job_title, job_description, required_skills, experience, salary_range, expiry_date, job_type, posted_date, location, image_url, company, recruiter_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Add recruiterId to the query parameters
        db.query(sql, [jobTitle, jobDescription, requiredSkills, experience, salaryRange, expiryDate, jobType, postedDate, jobLocation, imageUrl, company, recruiterId], (err, result) => {
            if (err) {
                console.error('Error saving job posting:', err);
                return res.status(500).json({ message: 'Failed to save job posting' });
            }
            return res.status(201).json({ message: 'Job posting saved successfully' });
        });
    } catch (error) {
        console.error('JWT error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});
// Route để nhận thông tin ứng tuyển
app.post('/api/apply', upload.single('cv'), (req, res) => {
    console.log('Request body:', req.body);
    // If you are using session and want to get user ID, you can uncomment the next line
    // console.log('User ID:', req.user.id);

    const { fullName, email, coverLetter, jobId } = req.body; // Removed userId from here
    const cvPath = req.file ? req.file.path : null;

    // Updated the check for required fields to exclude userId
    if (!fullName || !email || !coverLetter || !cvPath || !jobId) {
        return res.status(400).json({ message: 'Thiếu các trường bắt buộc' });
    }

    const sql = 'INSERT INTO applications (name, email, cover_letter, cv, job_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [fullName, email, coverLetter, cvPath, jobId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Lỗi khi lưu đơn ứng tuyển' });
        }
        res.status(200).json({ message: 'Đơn ứng tuyển đã được gửi thành công' });
    });
});


// API để lưu hồ sơ ứng viên
app.post('/api/candidate-profile', upload.single('profilePicture'), (req, res) => {
    const { fullName, email, workExperience, education } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    if (!fullName || !email || !profilePicture || !workExperience || !education) {
        return res.status(400).json({ message: 'Thiếu các trường bắt buộc' });
    }

    // Kiểm tra email đã tồn tại chưa
    const checkEmailSql = 'SELECT * FROM candidate_profiles WHERE email = ?';
    db.query(checkEmailSql, [email], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Lỗi kiểm tra email' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Nếu email chưa tồn tại, tiếp tục lưu dữ liệu
        const sql = 'INSERT INTO candidate_profiles (full_name, email, profile_picture, work_experience, education) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [fullName, email, profilePicture, workExperience, education], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Lỗi khi lưu thông tin ứng viên' });
            }
            res.status(200).json({ message: 'Lưu thông tin ứng viên thành công' });
        });
    });
});




// API để lấy danh sách ứng viên
app.get('/api/candidates', (req, res) => {
    const sql = 'SELECT * FROM candidate_profiles';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách ứng viên:', err);
            return res.status(500).json({ message: 'Lấy danh sách ứng viên thất bại' });
        }

        return res.status(200).json(results);
    });
});
app.get('/api/applications/:jobId', (req, res) => {
    const { jobId } = req.params;
    const sql = 'SELECT * FROM applications WHERE job_id = ?';

    db.query(sql, [jobId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách ứng tuyển:', err);
            return res.status(500).json({ message: 'Lấy danh sách ứng tuyển thất bại' });
        }

        return res.status(200).json(results);
    });
});
// app.get('/api/applicants/:jobId', (req, res) => {
//     const { jobId } = req.params;  // Lấy jobId từ URL
//     const sql = `
//         SELECT applications.id, applications.name, job_postings.experience, applications.status, job_postings.job_title
//         FROM applications
//         JOIN job_postings ON applications.job_id = job_postings.id
//         WHERE applications.job_id = ?  // Lọc ứng viên theo job_id
//     `;
//     db.query(sql, [jobId], (err, results) => {
//         if (err) {
//             console.error('Lỗi khi lấy danh sách ứng viên:', err);
//             res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng viên' });
//         } else {
//             res.json(results);  // Trả về kết quả lọc theo job_id
//         }
//     });
// });
async function ensureAuthenticatedd(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header
    if (!token) {
        return res.status(401).json({ message: 'Access Token not found' });
    }

    try {
        const decoded = jwt.verify(token, config.accessTokenSecret);
        console.log('Payload sau khi decode:', decoded); // Kiểm tra payload
        req.user = { id: decoded.userId }; // Đặt userId vào req.user
        next();
    } catch (err) {
        console.error('Lỗi xác thực token:', err);
        return res.status(401).json({ message: 'Access Token invalid or expired' });
    }
}

app.get('/api/applicants', ensureAuthenticatedd, (req, res) => {
    const userId = req.user.id; // Lấy userId từ middleware ensureAuthenticated

    const sql = `
        SELECT applications.id, applications.name, applications.cv, applications.email,
               applications.status, applications.application_date,
               job_postings.job_title, job_postings.experience, 
               job_postings.job_description, job_postings.required_skills,
               job_postings.recruiter_id
        FROM applications
        JOIN job_postings ON applications.job_id = job_postings.id
        WHERE job_postings.recruiter_id = ?`; // So sánh recruiter_id với userId

    console.log(userId);

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách ứng viên:', err);
            return res.status(500).json({ message: 'Lỗi khi lấy danh sách ứng viên' });
        }

        // Cập nhật đường dẫn CV thành URL đầy đủ
        const baseUrl = 'http://localhost:3001'; // Thay thế bằng URL server của bạn
        const updatedResults = results.map(result => ({
            ...result,
            cv: `${baseUrl}/${result.cv.replace(/\\/g, '/')}` // Đổi "\\" thành "/"
        }));

        res.json(updatedResults); // Trả về kết quả
    });
});




// In your Express server file
app.use(express.json());
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function repairAndParsePDF(buffer) {
    try {
        const pdfDoc = await PDFDocument.load(buffer);  // Tải tệp PDF
        const repairedBuffer = await pdfDoc.save();  // Tái lưu tệp để sửa lỗi cấu trúc
        const data = await pdfParse(repairedBuffer);  // Phân tích tệp PDF tái lưu
        return data.text;
    } catch (error) {
        console.error("Error repairing or parsing PDF:", error.message);
        throw error;
    }
}


// In your Express server file
app.use(express.json());
const gemiAI = new GoogleGenerativeAI("AIzaSyDujl7jCTfhCT1Apwb9UJdIR8uSdyGCRQw");

app.post('/api/evaluate_cv', uploadd.single('cv_file'), async (req, res) => {
    console.log('Dữ liệu nhận được:', req.body); // Log dữ liệu từ frontend
    console.log('File tải lên:', req.file); // Log file được tải lên

    try {
        const { job_description, required_skills } = req.body;
        const cvFile = req.file;

        if (!cvFile || !cvFile.buffer) {
            console.error("Không nhận được buffer của file tải lên.");
            return res.status(400).json({ error: 'File không hợp lệ hoặc bị thiếu.' });

        }

        // Kiểm tra xem cvFile.buffer có tồn tại và có phải là Buffer không


        let pdfData;
        try {
            pdfData = await pdfParse(cvFile.buffer); // Phân tích từ buffer
            cvContent = pdfData.text;
            console.log("Nội dung CV đã phân tích:", cvContent); // Log nội dung CV đã phân tích
        } catch (error) {
            console.error("Lỗi Phân Tích PDF:", error.message);
            return res.status(400).json({ error: `Không thể xử lý tệp CV: ${error.message}` });
        }

        // Khởi tạo mô hình AI
        const model = gemiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Đánh giá mức độ liên quan của CV sau đây với mô tả công việc và các kỹ năng cần thiết dưới đây:
        
        
        
        CV: ${cvContent}
        
        Mô tả công việc: ${job_description}
        
        Kỹ năng bắt buộc: ${required_skills}
        
        Tính toán tỷ lệ phần trăm phù hợp dựa trên các kỹ năng và kinh nghiệm cần thiết, đồng thời đưa ra đánh giá tổng quan.
        `;

        try {
            const response = await model.generateContent([prompt]);
            console.log("Phản hồi từ AI:", JSON.stringify(response, null, 2)); // Log phản hồi chi tiết

            // Trích xuất kết quả từ phản hồi
            const evaluationResult = response && response.response && response.response.candidates && response.response.candidates.length > 0
                ? response.response.candidates[0].content.parts[0].text // Lấy nội dung đánh giá
                : "Không tìm thấy kết quả đánh giá.";

            return res.json({ evaluation_result: evaluationResult });
        } catch (error) {
            console.log("Lỗi từ Gemini API: ", error.message);
            return res.status(500).json({ error: `Lỗi khi gọi Gemini API: ${error.message}` });
        }

    } catch (error) {
        console.log("Lỗi không mong muốn: ", error.message);
        return res.status(500).json({ error: 'Có lỗi không mong muốn xảy ra.' });
    }
});
app.get('/api/applicants/:id', (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số URL
    const sql = `
        SELECT a.*, j.job_description, j.required_skills
        FROM applications AS a
                 JOIN job_postings AS j ON a.job_id = j.id
        WHERE a.id = ?
    `; // Truy vấn để lấy thông tin ứng viên và thông tin từ bảng job_postings

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy thông tin ứng viên:', err);
            return res.status(500).json({ message: 'Lấy thông tin ứng viên thất bại' });
        }

        // Kiểm tra xem có ứng viên nào với ID đã cho không
        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ứng viên với ID đã cho.' });
        }

        // Lấy thông tin ứng viên và các trường liên quan
        const applicant = results[0];
        const jobDescription = applicant.job_description;
        const requiredSkills = applicant.required_skills;

        // Log job_description và required_skills
        console.log('Job Description:', jobDescription);
        console.log('Required Skills:', requiredSkills);

        // Trả về thông tin ứng viên cùng với thông tin từ job_postings
        return res.status(200).json(applicant);
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Đoạn mã trong file server.js (hoặc nơi bạn định nghĩa API)
app.post('/api/applicants/:id/reject', (req, res) => {
    const applicantId = req.params.id;

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';
    db.query(sql, ['rejected', applicantId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Lỗi khi từ chối ứng viên' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ứng viên không tồn tại' });
        }

        res.status(200).json({ message: 'Ứng viên đã bị từ chối' });
    });
});
app.post('/api/applicants/:id/accept', (req, res) => {
    const applicantId = req.params.id;

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';
    db.query(sql, ['accepted', applicantId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Lỗi khi từ chối ứng viên' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ứng viên không tồn tại' });
        }

        res.status(200).json({ message: 'Ứng viên đã bị từ chối' });
    });
});


app.post('/api/evaluate_all_cvs', async (req, res) => {
    console.log("API evaluate_all_cvs được gọi");

    // Log thông tin nhận được từ body (data gửi từ frontend)
    console.log("Thông tin body nhận được:", req.body); // Để kiểm tra thông tin body gửi từ frontend

    // Log thông tin về các file nếu có
    if (req.files) {
        console.log("Các file tải lên:", req.files); // Nếu sử dụng nhiều file
    } else if (req.file) {
        console.log("File tải lên:", req.file); // Nếu sử dụng một file
    }

    try {
        // Truy vấn tất cả các ứng viên và công việc tương ứng từ database
        const [applications] = await db.promise().query(`
            SELECT a.id as application_id, a.name, a.cv, a.job_id, j.job_description, j.required_skills
            FROM applications a
            JOIN job_postings j ON a.job_id = j.id
        `);

        // Kiểm tra nếu không có ứng viên nào
        if (!applications.length) {
            return res.status(404).json({ message: 'Không có ứng viên nào để đánh giá.' });
        }

        const results = [];

        // Duyệt qua từng ứng viên và đánh giá CV của họ
        for (const application of applications) {
            const { cv, job_description, required_skills } = application;

            // Log thông tin ứng viên và công việc
            console.log("Thông tin ứng viên:", application);
            console.log("Mô tả công việc:", job_description);
            console.log("Kỹ năng yêu cầu:", required_skills);

            // Phân tích PDF để lấy nội dung CV
            let cvContent = '';
            try {
                const pdfData = await pdfParse(Buffer.from(cv, 'base64')); // Giả sử CV lưu dưới dạng base64
                cvContent = pdfData.text;
            } catch (error) {
                console.error("Lỗi phân tích CV:", error.message);
                continue; // Nếu không thể phân tích CV, bỏ qua ứng viên này
            }

            // Log nội dung CV đã phân tích
            console.log("Nội dung CV đã phân tích:", cvContent);

            // Tạo prompt cho AI
            const prompt = `
                Đánh giá mức độ liên quan của CV sau đây với mô tả công việc và các kỹ năng cần thiết dưới đây:

                CV: ${cvContent}

                Mô tả công việc: ${job_description}

                Kỹ năng bắt buộc: ${required_skills}

                Tính toán tỷ lệ phần trăm phù hợp dựa trên các kỹ năng và kinh nghiệm cần thiết, đồng thời đưa ra đánh giá tổng quan.
            `;

            // Gọi AI để đánh giá CV
            try {
                const model = gemiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const response = await model.generateContent([prompt]);
                const evaluationResult = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy kết quả đánh giá.";

                // Thêm kết quả đánh giá vào danh sách kết quả
                results.push({
                    application_id: application.application_id,
                    name: application.name,
                    evaluation_result: evaluationResult
                });

                // Log kết quả đánh giá
                console.log("Kết quả đánh giá ứng viên:", evaluationResult);

            } catch (error) {
                console.error("Lỗi khi gọi Gemini API:", error.message);
                continue; // Nếu có lỗi khi gọi AI, bỏ qua ứng viên này
            }
        }

        // Trả về kết quả đánh giá của tất cả các ứng viên
        return res.json({ evaluations: results });

    } catch (error) {
        console.error("Lỗi không mong muốn: ", error.message);
        return res.status(500).json({ error: 'Có lỗi không mong muốn xảy ra.' });
    }
});
app.post('/messages', (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    const sql = `INSERT INTO messages (first_name, last_name, email, subject, message) 
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [firstName, lastName, email, subject, message], (err, result) => {
        if (err) {
            console.error('Lỗi khi lưu tin nhắn:', err);
            res.status(500).json({ error: 'Lỗi lưu tin nhắn' });
        } else {
            res.status(200).json({ message: 'Tin nhắn đã được lưu thành công!' });
        }
    });
});

// Route: Lấy danh sách tin nhắn
app.get('/messages', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách tin nhắn:', err);
            res.status(500).json({ error: 'Lỗi lấy danh sách tin nhắn' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/job_market_questions', async (req, res) => {
    const { chatHistory } = req.body;

    if (!chatHistory || !Array.isArray(chatHistory)) {
        return res.status(400).json({ error: "Lịch sử hội thoại không hợp lệ." });
    }

    // Chuyển lịch sử hội thoại thành chuỗi để gửi đến mô hình AI
    const chatContext = chatHistory
        .map((chat) => `${chat.role === "user" ? "Người dùng" : "Chatbot"}: ${chat.content}`)
        .join("\n");

    const prompt = `
        Tiếp tục cuộc trò chuyện sau đây. Chỉ trả lời những câu hỏi liên quan đến việc làm. Nếu không có câu hỏi rõ ràng, hãy phản hồi một cách lịch sự:
        
        ${chatContext}
        
       
    `;

    try {
        const response = await gemiAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent([prompt]);

        const answer = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi không chắc chắn.";
        return res.json({ answer });
    } catch (error) {
        console.error("Lỗi từ mô hình AI:", error);
        return res.status(500).json({ error: "Lỗi khi xử lý câu trả lời." });
    }
});

app.post('/api/evaluate_cv1', uploadd.single('cv_file'), async (req, res) => {
    console.log('Dữ liệu nhận được:', req.body); // Log dữ liệu từ frontend
    console.log('File tải lên:', req.file); // Log file được tải lên

    try {

        const cvFile = req.file;

        if (!cvFile || !cvFile.buffer) {
            console.error("Không nhận được buffer của file tải lên.");
            return res.status(400).json({ error: 'File không hợp lệ hoặc bị thiếu.' });

        }

        // Kiểm tra xem cvFile.buffer có tồn tại và có phải là Buffer không


        let pdfData;
        try {
            pdfData = await pdfParse(cvFile.buffer); // Phân tích từ buffer
            cvContent = pdfData.text;
            console.log("Nội dung CV đã phân tích:", cvContent); // Log nội dung CV đã phân tích
        } catch (error) {
            console.error("Lỗi Phân Tích PDF:", error.message);
            return res.status(400).json({ error: `Không thể xử lý tệp CV: ${error.message}` });
        }

        // Khởi tạo mô hình AI
        const model = gemiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
       Tóm tắt nội ngắn gọi nội dung CV dưới đây:
        
        
        
        CV: ${cvContent}
        
       
        
      
        `;

        try {
            const response = await model.generateContent([prompt]);
            console.log("Phản hồi từ AI:", JSON.stringify(response, null, 2)); // Log phản hồi chi tiết

            // Trích xuất kết quả từ phản hồi
            const evaluationResult = response && response.response && response.response.candidates && response.response.candidates.length > 0
                ? response.response.candidates[0].content.parts[0].text // Lấy nội dung đánh giá
                : "Không tìm thấy kết quả đánh giá.";

            return res.json({ evaluation_result: evaluationResult });
        } catch (error) {
            console.log("Lỗi từ Gemini API: ", error.message);
            return res.status(500).json({ error: `Lỗi khi gọi Gemini API: ${error.message}` });
        }

    } catch (error) {
        console.log("Lỗi không mong muốn: ", error.message);
        return res.status(500).json({ error: 'Có lỗi không mong muốn xảy ra.' });
    }
});

app.get('/applications', (req, res) => {
    const sql = 'SELECT * FROM applications';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách applications:', err);
            return res.status(500).json({ message: 'Lấy danh sách thất bại' });
        }

        // Trả về danh sách applications
        return res.status(200).json(results);
    });
});
// Xóa ứng viên
app.delete('/applications/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM applications WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi xóa application:', err);
            return res.status(500).json({ message: 'Xóa ứng viên thất bại' });
        }
        return res.status(200).json({ message: 'Xóa ứng viên thành công' });
    });
});

// Cập nhật thông tin ứng viên
app.put('/applications/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';

    db.query(sql, [status, id], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật status ứng viên:', err);
            return res.status(500).json({ message: 'Cập nhật status thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật status thành công' });
    });
});
// API để lấy số lượng user, applications, messages, job postings
app.get('/api/users/count', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json({ count: results.length }); // Đếm số dòng trong kết quả
    });
});

app.get('/api/count', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM applications'; // Đếm số lượng dòng
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching applications count:', err);
            return res.status(500).json({ error: 'Failed to fetch applications count' });
        }
        console.log('Result:', results); // Log ra kết quả để kiểm tra
        res.json({ count: results[0].count }); // Trả về count
    });
});

app.get('/api/messages/count', (req, res) => {
    const query = 'SELECT * FROM messages';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
        res.json({ count: results.length }); // Đếm số dòng trong kết quả
    });
});

app.get('/api/job_postings/count', (req, res) => {
    const query = 'SELECT * FROM job_postings';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching job postings:', err);
            return res.status(500).json({ error: 'Failed to fetch job postings' });
        }
        res.json({ count: results.length }); // Đếm số dòng trong kết quả
    });
});
app.post('/api/evaluate_cv_all', uploadd.array('cv_files', 10), async (req, res) => {
    console.log('Dữ liệu nhận được:', req.body); // Log dữ liệu từ frontend
    console.log('Files tải lên:', req.files); // Log các file được tải lên

    try {
        const { job_description, required_skills } = req.body;
        const cvFiles = req.files;

        if (!cvFiles || cvFiles.length === 0) {
            console.error("Không nhận được file tải lên.");
            return res.status(400).json({ error: 'Không có file nào được tải lên.' });
        }

        const results = []; // Lưu trữ kết quả đánh giá của tỷ lệ phần trăm phù hợp

        for (const cvFile of cvFiles) {
            // Kiểm tra tính hợp lệ của file
            if (!cvFile.buffer) {
                console.error(`File ${cvFile.originalname} không hợp lệ hoặc bị thiếu.`);
                results.push("File không hợp lệ hoặc bị thiếu.");
                continue;
            }

            let pdfData;
            let cvContent;

            try {
                // Phân tích nội dung từ file PDF
                pdfData = await pdfParse(cvFile.buffer);
                cvContent = pdfData.text;
            } catch (error) {
                console.error(`Lỗi Phân Tích PDF (${cvFile.originalname}):`, error.message);
                results.push("Không thể xử lý tệp CV.");
                continue;
            }

            // Khởi tạo mô hình AI
            const model = gemiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            Dựa trên mô tả công việc và các kỹ năng yêu cầu, đánh giá mức độ phù hợp của ứng viên với công việc. Chỉ hiển thị tỷ lệ phần trăm phù hợp, ví dụ: "80% phù hợp". Không cần thêm bất kỳ phân tích hay giải thích nào.
            Mô tả công việc: ${job_description}
            Kỹ năng yêu cầu: ${required_skills}
            Nội dung CV: ${cvContent}
            `;

            try {
                // Gọi mô hình AI để đánh giá CV
                const response = await model.generateContent([prompt]);

                const evaluationResult = response &&
                response.response &&
                response.response.candidates &&
                response.response.candidates.length > 0
                    ? response.response.candidates[0].content.parts[0].text // Lấy nội dung đánh giá
                    : "Không tìm thấy kết quả đánh giá.";

                // Lọc tỷ lệ phần trăm phù hợp
                const matchPercentage = evaluationResult.match(/(\d+)%/); // Tìm tỷ lệ phần trăm
                const percentage = matchPercentage ? matchPercentage[0] : "Không xác định";

                results.push(percentage);
            } catch (error) {
                console.log(`Lỗi từ Gemini API (${cvFile.originalname}):`, error.message);
                results.push("Lỗi khi gọi Gemini API.");
            }
        }

        // Trả về kết quả chỉ gồm tỷ lệ phần trăm phù hợp
        return res.json({ results });
    } catch (error) {
        console.log("Lỗi không mong muốn: ", error.message);
        return res.status(500).json({ error: 'Có lỗi không mong muốn xảy ra.' });
    }
});

// Chạy server trên cổng 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});