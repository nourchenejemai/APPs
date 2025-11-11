import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import BackButton from '../components/BackButton'

const Login = () => {

  const navigate = useNavigate()

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    return regex.test(password)
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    
    if (value === '') {
      setEmailError('')
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    
    if (state === 'register') {
      if (value === '') {
        setPasswordError('')
      } else if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters long')
      } else if (!validatePassword(value)) {
        setPasswordError('Password must contain at least one letter and one number')
      } else {
        setPasswordError('')
      }
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true

      // Validate email
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address")
        return
      }

      // Validate password for registration
      if (state === 'register' && !validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters long and contain at least one letter and one number')
        return
      }

      // Clear errors if validation passes
      setEmailError('')
      setPasswordError('')

      if (state === 'register') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { 
          name, 
          email, 
          password 
        })
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
          toast.success("Account created successfully!")
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          toast.success("Login successful!")
          // Redirect based on role
          if (data.role === 'admin') {
            navigate('/admin') // admin dashboard
          } else {
            navigate('/') // regular user home
          }
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error('An unexpected error occurred.')
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-b from-blue-100 to-blue-300'>
      <div className='w-full max-w-md'>
        {/* Back Button positioned at top left */}
        <div className='absolute top-6 left-6'>
        </div>
        
        {/* Login Form */}
        <div className='bg-white p-10 rounded-lg shadow-lg w-full text-indigo-300 text-sm'>
          <img src={assets.c} alt="logo" className="mx-auto w-30 h-20 mb-6" />

          <h2 className='text-3xl font-semibold text-blue-700 text-center mb-3'>
            {state === 'register' ? 'Create Your Account' : 'Login'}
          </h2>
          <p className='text-center text-sm mb-6'>
            {state === 'register' ? '' : 'Sign in to your account!'}
          </p>

          <form onSubmit={handleSubmit}>
            {state === 'register' && (
              <div className='mb-4'>
                <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#f0f1f4]'>
                  <img src={assets.person_icon} alt="" />
                  <input 
                    onChange={e => setName(e.target.value)}
                    value={name}
                    className='bg-transparent outline-none text-blue-950 w-full' 
                    type="text"
                    placeholder='Full Name' 
                    required 
                  />
                </div>
              </div>
            )}
            
            <div className='mb-4'>
              <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#f0f1f4]'>
                <img src={assets.mail_icon} alt="" />
                <input 
                  onChange={handleEmailChange}
                  value={email}
                  className='bg-transparent outline-none text-blue-950 w-full'
                  type="email" 
                  placeholder='ex: name@example.com' 
                  required 
                />
              </div>
              {emailError && <p className="text-red-500 text-xs mt-2 ml-4">{emailError}</p>}
            </div>

            <div className='mb-4'>
              <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#f0f1f4]'>
                <img src={assets.lock_icon} alt=""/>
                <input 
                  onChange={handlePasswordChange}
                  value={password}
                  className='bg-transparent outline-none text-blue-950 w-full' 
                  type="password"
                  placeholder='Password' 
                  required 
                />
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-2 ml-4">{passwordError}</p>}
            </div>

            {state === 'register' && (
              <div className='mb-4 text-xs text-gray-500 text-center'>
                
              </div>
            )}
            
            <p 
              onClick={() => navigate('/reset-password')} 
              className='mb-4 text-indigo-500 cursor-pointer text-sm text-center'
            >
              Forgot Password?
            </p>

            <button 
              type="submit"
              className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!!emailError || !!passwordError}
            >
              {state === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {state === 'register' ? (
            <p className='text-gray-400 text-center text-xs mt-4'>
              Already have an account? {''}
              <span 
                onClick={() => setState('login')} 
                className='text-blue-400 cursor-pointer underline'
              >
                Sign In
              </span>
            </p>
          ) : (
            <p className='text-gray-400 text-center text-xs mt-4'>
              Don't have an account? {''}
              <span 
                onClick={() => setState('register')} 
                className='text-blue-400 cursor-pointer underline'
              >
                Create Account
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login 