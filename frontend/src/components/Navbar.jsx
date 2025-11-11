import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import logoCerte from '../assets/logoCerte.png'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Nouvel état pour le menu utilisateur
  
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Gestion des clics en dehors des dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer le dropdown Data Analysis
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      // Fermer le menu utilisateur
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <nav className="bg-blue-800 text-white shadow-md z-[1000] h-20 flex items-center w-full border-b top-0">
      <div className="max-w-screen-xl mx-auto flex w-full justify-between px-4 sm:px-6 items-center">
        <div className="flex items-center space-x-4">
          <img
            src={logoCerte}
            alt="Logo"
            className="w-16 h-auto object-contain"
          />
          <p
            className="text-lg sm:text-xl md:text-2xl font-semibold cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Smart Water BZ
          </p>
        </div>

        <div className="flex items-center space-x-6 relative">
          <a href="/" className="hover:text-blue-300">Home</a>
          <a href="/VisulisationSensor" className="hover:text-blue-300">Sensor Dashboard</a>

        

          {/* Dropdown Button Data Analysis */}
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 hover:text-blue-300"
              >
                Data Analysis
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              {showDropdown && (
                <ul className="absolute bg-white text-black mt-2 rounded-md shadow-md w-44 z-[1001]">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/delegation">Délégation</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/climat">Climat</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/cnbz">CnBZ</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/geologie">Géologie</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/pedologie">Pédologie</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/vertisol">Vertisol</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/reseaux">Réseaux Hydro</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/barrage">Barrages</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/forages">Forages</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/nappes">Nappes Phréatiques</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/admin/nappepro">Nappes Profondes</a>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
              Data Analysis
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <a href="/aboutUs" className="hover:text-blue-300">About</a>
          <a href="/contact" className="hover:text-blue-300">Contact</a>
       
          {userData ? (
            <div 
              className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer z-[1002]'
              ref={userMenuRef}
            >
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full h-full flex justify-center items-center"
              >
                {userData.name[0].toUpperCase()}
              </button>
              
              {userMenuOpen && (
                <div className='absolute top-full right-0 mt-2 z-[1003] text-black rounded shadow-lg'>
                  <ul className='list-none m-0 p-2 bg-white border border-gray-200 rounded-md min-w-32 shadow-xl'>
                    {!userData.isAccountVerified && (
                      <li 
                        onClick={sendVerificationOtp} 
                        className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-sm transition-colors'
                      >
                        Check email
                      </li>
                    )}
                    {/* Option Dashboard dans le menu utilisateur pour les admins */}
                    {userData.role === 'admin' && (
                      <li className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-sm transition-colors'>
                        <a href="/admin" className="block">Dashboard Admin</a>
                      </li>
                    )}
                    {userData.role === 'user' && (
                      <li className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-sm transition-colors'>
                        <a href="/dashboardUser" className="block">Dashboard User</a>
                      </li>
                    )}
                    
                    <li 
                      onClick={logout} 
                      className='py-2 px-3 hover:bg-red-50 cursor-pointer rounded-sm transition-colors border-t border-gray-100 mt-1 text-red-600'
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 bg-white transition-all hover:bg-gray-50'>
              Login <img src={assets.arrow_icon} alt="Flèche" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;