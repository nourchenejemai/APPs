import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
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
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-blue-300">
      <Navbar />
      
      <div className="pt-24 px-6 text-gray-800 h-full">
        
        {/* Centered Form */}
        <div className="flex justify-center items-center h-full">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Contact Us</h2>

            <div className="mb-4">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
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
                placeholder="Your email"
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
                placeholder="Your message"
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
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;