import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState('inscrire')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSubitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (!validateEmail(email)) {
        setError("Veuillez saisir une adresse e-mail valide.");
        return;
      }else{
      setError('');
         console.log("Adresse e-mail valide :", email);
       };

      if (state === 'inscrire') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }


      }

    } catch (error) {
      toast.error(data.message)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }

    }

  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-blue-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'inscrire' ? 'créez votre compte' : 'Se connecter'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'inscrire' ? '' : 'Connectez-vous à votre compte!'}</p>
        <form onSubmit={onSubitHandler}>
          {state === 'inscrire' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none' type="text"
                placeholder='Nom et Prenom' required />

            </div>
          )}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none'
              type="email" placeholder='ex : nom@exemple.com' required />
              {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none' type="password"
              placeholder='Mot de Passe' required />
          </div>
          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Mot de passe oublié ?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
        {state === 'inscrire' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Vous avez déjà un compte ? {''}
            <span onClick={() => setState('Se connecter')} className='text-blue-400 cursor-pointer underline'>Se connecter</span>
          </p>)
          : (
            <p className='text-gray-400 text-center text-xs mt-4'>Vous n’avez pas encore de compte ?{''}
              <span onClick={() => setState('inscrire')} className='text-blue-400 cursor-pointer underline'>Créer un compte</span>
            </p>)}

      </div>
    </div>
  )
}

export default Login