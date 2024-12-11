import React, {useEffect, useState} from 'react';
import Navigation from './Navigation'; // Import Navigation component
import TopBar from './TopBar';         // Import TopBar component
import CardBox from './CardBox';       // Import CardBox component
import OrderDetails from './OrderDetails'; // Import OrderDetails component
import RecentCustomers from './RecentCustomers'; // Import RecentCustomers component
// import './assets/css/style.css';       // Import CSS styles
import '../../styles/admin.css';
import axios from "axios";

const Comment = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch job postings from the server
        axios.get('http://localhost:3001/messages') // Đảm bảo đúng URL server của bạn
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu message:', error);
            });
    }, []);
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/messages/${id}`)
            .then(response => {
                alert(response.data.message);
                setMessages(messages.filter(message => message.id !== id));
            })
            .catch(error => {
                console.error('Error deleting message:', error);
                alert('Failed to delete message.');
            });
    };
    const handleEdit = (message) => {
        const newfirstname = prompt('Enter new first name:', message.first_name);
        const newlastname = prompt('Enter new last name:', message.last_name);
        const newemail = prompt('Enter new email:', message.email);
        const newsubject = prompt('Enter new subject:', message.subject);
        const newmessage = prompt('Enter new message:', message.message);

        if (newfirstname && newlastname && newemail && newsubject && newmessage) {
            axios.put(`http://localhost:3001/messages/${message.id}`, {
                first_name: newfirstname,
                last_name: newlastname,
                email: newemail,
                subject: newsubject,
                message: newmessage
            })
                .then(response => {
                    alert(response.data.message);

                    // Cập nhật lại state messages mà không làm thay đổi thông tin khác
                    setMessages(prevMessages =>
                        prevMessages.map(u =>
                            u.id === message.id
                                ? {
                                    ...u,
                                    first_name: newfirstname,
                                    last_name: newlastname,
                                    email: newemail,
                                    subject: newsubject,
                                    message: newmessage
                                }
                                : u
                        )
                    );
                })
                .catch(error => {
                    console.error('Error updating message:', error);
                    alert('Failed to update message.');
                });
        }
    };

    return (
        <div >


            {/* Navigation Section */}
            <Navigation />

            {/* Main Content */}
            <div className="main">
                {/* TopBar Section */}




                {/* Details Section */}
                <div style={{justifyContent:"center",alignItems:"center",display:"flex"}} className="details">
                    <div className="recentOrders">
                        <div className="cardHeader">
                            <h2>Comment</h2>

                        </div>
                        <table>
                            <thead>
                            <tr>
                                <td>First name</td>
                                <td>Last name</td>

                                <td>email</td>
                                <td>Subject</td>
                                <td>Message</td>
                                <td>Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {messages.map((message, index) => (
                                <tr key={index}>
                                    <td>{message.first_name}</td>
                                    <td>{message.last_name}</td>


                                    <td>{message.email}</td>
                                    <td>{message.subject}</td>
                                    <td>{message.message}</td>
                                    <td>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleEdit(message)}
                                                    className="btn btn-success btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top" title="Edit"><i
                                                className="fa fa-edit"></i></button>
                                        </li>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleDelete(message.id)}
                                                    className="btn btn-danger btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top" title="Delete"><i
                                                className="fa fa-trash"></i></button>
                                        </li>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Comment;
