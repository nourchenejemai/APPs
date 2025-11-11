import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx'
import ContenuHome from '../pages/ContenuHome.jsx';


const Home = () => {
    return (
      <div className="absolute inset-0 flex flex-col">
        <Navbar />
        <ContenuHome />
    </div>
  );
};

export default Home;