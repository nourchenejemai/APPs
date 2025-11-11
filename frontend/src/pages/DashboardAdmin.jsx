import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import "leaflet/dist/leaflet.css";

import Sidebar from '../components/Sidebar';
import NavbarAdmin from '../components/NavbarAdmin';
import MainContentSection from './MainContentSection';


function DashboardAdmin() {
  // Section 1: NavbarAdmin
  const NavbarSection = () => (
    <NavbarAdmin />
  );

  // Section 2: Sidebar
  const SidebarSection = () => (
    <Sidebar />
  );

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen overflow-hidden">
    
        {/* Section 3: Main Content with Routing */}
        <div className="flex-1 overflow-auto">
         
              <MainContentSection />

              
        </div>
        </div>
 
  );
}

export default DashboardAdmin;