import React, { useEffect, useState } from 'react';
import Navbar from '../components/home/Navbar.jsx'
import ContenuHome from '../pages/ContenuHome.jsx';
import FeatureSection from '../pages/FeatureSection.jsx'


const Home = () => {
    return (
      <div className="absolute inset-0 flex flex-col">
        <Navbar />
        <ContenuHome />
        <FeatureSection />
    </div>
  );
};

export default Home;