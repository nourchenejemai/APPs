import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import logoCerte from '../../assets/logoCerte.png'

import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Navbar = () => {

  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false);


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
  return (
    <nav className="bg-blue-800 text-white shadow-md z-50 h-20 flex items-center w-full border-b top-0">
  <div className="max-w-screen-xl mx-auto flex w-full justify-between px-4 sm:px-6 items-center">
    <div className="flex items-center space-x-4">
      <img
        src={logoCerte}
        alt="Logo"
        className="w-12 sm:w-16 md:w-20" // More responsive sizing
      />
      <p className="text-lg sm:text-xl md:text-2xl font-semibold">
        SmartWater BZ
      </p>
    </div>

        <div className="flex items-center space-x-6 relative">
          <a href="/" className="hover:text-blue-300">Home</a>
       
          <a href="/bizerte" className="hover:text-blue-300">Map View</a>
          <a href="/VisulisationSensor" className="hover:text-blue-300">Sensors Dashboard</a>
          <a href="#" className="hover:text-blue-300">Data Analytics</a>

        
      {/* Dropdown Button 
      <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 hover:text-blue-300"
            >
              Nappes
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            * Dropdown Menu 
            {showDropdown && (
              <ul className="absolute bg-white text-black mt-2 rounded-md shadow-md w-44">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <a href="#">Nappes Phreatiques</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <a href="#">Nappes Profondes</a>
                </li>
              </ul>
            )}
          </div> */}

        <a href="#" className="hover:text-blue-300">About</a>

      
        <a href="/contact" className="hover:text-blue-300">Contact</a>


       

        {userData ? (
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded '>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm shadow-md'>
                {!userData.isAccountVerified && (
                  <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>
                    Vérifier l'e-mail
                  </li>
                )}
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>
                  Déconnexion
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 bg-white transition-all'>
            Login <img src={assets.arrow_icon} alt="Arrow Icon" />
          </button>
        )}
      </div>
      </div>

    </nav>
  )
}

export default Navbar 