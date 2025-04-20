import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DonorDashboard.css';
import Header from '../../components/header';
import Banner from '../../components/Banner';
import DisasterRelief from '../../components/DisataserRelief';
import DonationStats from '../../components/DonationStats';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <Header />
            <Banner />
            <div className="dashboard">
                <h1>Welcome, {user?.name || 'Donor'}!</h1>
                <div className="dashboard-sections">
                    <div className="card" onClick={() => navigate('/donate')}>
                        <h3>Make a Donation</h3>
                        <p>Start a new clothes donation.</p>
                    </div>

                    <div className="card" onClick={() => navigate('/MyDonations')}>
                        <h3>My Donations</h3>
                        <p>Track and view your past donations.</p>
                    </div>

                    <div className="card" onClick={() => navigate('/UserProfile')}>
                        <h3>My Profile</h3>
                        <p>Update your profile info and preferences.</p>
                    </div>

                    <div className="card logout" onClick={handleLogout}>
                        <h3>Logout</h3>
                        <p>Sign out of your account.</p>
                    </div>
                </div>
            </div>
            <DonationStats />
            <DisasterRelief />
        </>
    );
};

export default DonorDashboard;
