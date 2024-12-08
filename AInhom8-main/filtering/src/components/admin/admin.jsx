import React from 'react';
import Navigation from './Navigation'; // Import Navigation component
import TopBar from './TopBar';         // Import TopBar component
import CardBox from './CardBox';       // Import CardBox component
import OrderDetails from './OrderDetails'; // Import OrderDetails component
import RecentCustomers from './RecentCustomers'; // Import RecentCustomers component
// import './assets/css/style.css';       // Import CSS styles
import '../../styles/admin.css';

const Admin = () => {
    return (
        <div >

            {/* Navigation Section */}
            <Navigation />

            {/* Main Content */}
            <div className="main">
                {/* TopBar Section */}


                {/* CardBox Section */}
                <CardBox />

                {/* Details Section */}
                <div className="details">
                    {/* Order Details */}
                    <OrderDetails />

                    {/* Recent Customers */}
                    <RecentCustomers />
                </div>
            </div>
        </div>
    );
};

export default Admin;
