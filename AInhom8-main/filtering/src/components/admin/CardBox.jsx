import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { eyeOutline, cartOutline, chatbubblesOutline, cashOutline,homeOutline,peopleOutline,chatboxOutline,briefcaseOutline,documentTextOutline,logInOutline } from 'ionicons/icons';
import axios from 'axios';

function CardBox() {
    const [counts, setCounts] = useState({
        users: 0,
        applications: 0,
        messages: 0,
        jobPostings: 0,
    });

    const cards = [
        { number: counts.users || '0', name: 'Users', icon: peopleOutline },
        { number: counts.applications || '0', name: 'Applications', icon: briefcaseOutline },
        { number: counts.messages || '0', name: 'Messages', icon: chatbubblesOutline },
        { number: counts.jobPostings || '0', name: 'Job Postings', icon: documentTextOutline },
    ];

    useEffect(() => {
        // Gọi API để lấy số liệu
        axios.get('http://localhost:3001/api/users/count')
            .then(response => setCounts(prevCounts => ({ ...prevCounts, users: response.data.count })))
            .catch(error => console.error('Error fetching users count:', error));

        axios.get('http://localhost:3001/api/count')
            .then(response => setCounts(prevCounts => ({ ...prevCounts, applications: response.data.count })))
            .catch(error => console.error('Error fetching applications count:', error));

        axios.get('http://localhost:3001/api/messages/count')
            .then(response => setCounts(prevCounts => ({ ...prevCounts, messages: response.data.count })))
            .catch(error => console.error('Error fetching messages count:', error));

        axios.get('http://localhost:3001/api/job_postings/count')
            .then(response => setCounts(prevCounts => ({ ...prevCounts, jobPostings: response.data.count })))
            .catch(error => console.error('Error fetching job postings count:', error));
    }, []);

    return (
        <div className="cardBox">
            {cards.map((card, index) => (
                <div className="card" key={index}>
                    <div>
                        <div className="numbers">{card.number}</div>
                        <div className="cardName">{card.name}</div>
                    </div>
                    <div className="iconBx">
                        <IonIcon icon={card.icon} style={{ fontSize: '2rem', color: '#555' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardBox;
