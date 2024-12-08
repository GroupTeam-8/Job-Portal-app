import React, {useEffect, useState} from 'react';
import Navigation from './Navigation'; // Import Navigation component
import TopBar from './TopBar';         // Import TopBar component
import CardBox from './CardBox';       // Import CardBox component
import OrderDetails from './OrderDetails'; // Import OrderDetails component
import RecentCustomers from './RecentCustomers'; // Import RecentCustomers component
// import './assets/css/style.css';       // Import CSS styles
import '../../styles/admin.css';
import axios from "axios";

const User = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch job postings from the server
        axios.get('http://localhost:3001/users') // Đảm bảo đúng URL server của bạn
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu users:', error);
            });
    }, []);
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/users/${id}`)
            .then(response => {
                alert(response.data.message);
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
            });
    };
    const handleEdit = (user) => {
        const newEmail = prompt('Enter new email:', user.email);
        const newPassword = prompt('Enter new password:', user.password);
        const newUserType = prompt('Enter new user type:', user.usertype);

        if (newEmail && newPassword && newUserType) {
            axios.put(`http://localhost:3001/users/${user.id}`, {
                email: newEmail,
                password: newPassword,
                usertype: newUserType
            })
                .then(response => {
                    alert(response.data.message);
                    setUsers(users.map(u => u.id === user.id ? { ...u, email: newEmail, password: newPassword, usertype: newUserType } : u));
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    alert('Failed to update user.');
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
                            <h2>Users</h2>

                        </div>
                        <table>
                            <thead>
                            <tr>
                                <td>Email</td>
                                <td>ID</td>

                                <td>Password</td>
                                <td>User type</td>
                                <td>Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.id}</td>


                                    <td>{user.password}</td>
                                    <td>{user.usertype}</td>
                                    <td>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleEdit(user)} className="btn btn-success btn-sm rounded-0" type="button"
                                                    data-toggle="tooltip" data-placement="top" title="Edit"><i
                                                className="fa fa-edit"></i></button>
                                        </li>
                                        <li className="list-inline-item">
                                            <button onClick={() => handleDelete(user.id)}  className="btn btn-danger btn-sm rounded-0" type="button"
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

export default User;
