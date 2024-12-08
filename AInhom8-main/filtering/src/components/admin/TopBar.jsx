import React from 'react';
import { IonIcon } from '@ionic/react';

function TopBar() {
    return (
        <div className="topbar">
            <div className="toggle">
                <IonIcon name="menu-outline" />
            </div>
            <div className="search">
                <label>
                    <input type="text" placeholder="Search here" />
                    <IonIcon name="search-outline" />
                </label>
            </div>
            <div className="user">
                <img src="assets/imgs/customer01.jpg" alt="User" />
            </div>
        </div>
    );
}

export default TopBar;
