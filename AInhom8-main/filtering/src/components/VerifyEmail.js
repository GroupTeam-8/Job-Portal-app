// VerifyEmail.js
import React, { useState } from 'react';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');

    const handleVerify = async () => {
        const token = window.location.search.split('token=')[1];
        const res = await fetch(`http://localhost:3001/verify?token=${token}`);
        const data = await res.json();
        setMessage(data.message);
    };

    React.useEffect(() => {
        handleVerify();
    }, []);

    return <div>{message}</div>;
};

export default VerifyEmail;
