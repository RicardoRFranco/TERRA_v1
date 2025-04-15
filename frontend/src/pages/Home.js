import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home = () => {
    return (
        <div className="page">
            <Header />
            <main className="container">
                <h2>Welcome to TERRA App</h2>
                <p>Your application content goes here.</p>
            </main>
            <Footer />
        </div>
    );
};

export default Home;