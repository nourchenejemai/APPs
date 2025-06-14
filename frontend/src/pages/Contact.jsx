import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/home/Navbar.jsx';
import BackButton from '../components/BackButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/contact', formData);
      alert('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert("Échec de l'envoi du message");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-400">
      <Navbar />
      
      <div className="pt-24 px-6 text-gray-800 h-full">
        {/* BackButton fixed to top-left of form area */}
        <div className="absolute top-24 left-6">
          <BackButton />
        </div>

        {/* Centered Form */}
        <div className="flex justify-center items-center h-full">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Contactez-nous</h2>

            <div className="mb-4">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                placeholder="Votre message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="5"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-900 text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
