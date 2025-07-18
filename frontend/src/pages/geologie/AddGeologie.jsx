import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddGeologie() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    geom:'',
    superficie: '',
    age: '',
    lithologie: '',
    code: '',
    descript: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Addgeologie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire.');
      }

      alert('Formulaire soumis avec succès!');
      setForm({
        id: '',
        geom:'',
        superficie: '',
        age: '',
        lithologie: '',
        code: '',
        descript: ''
      });

    } catch (error) {
      alert(error.message);
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen pt-8 px-6 bg-blue-400 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-6">
          <BackButton destination='/geologie' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Un Climat</h2>
      
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
           <div className="grid grid-cols-2 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
            <input name="superficie" placeholder="Superficie" className="border p-2 rounded" value={form.superficie} onChange={handleChange} />

          </div>
        
          <div className="grid grid-cols-2 gap-4">
          <input name="age" placeholder="Age" className="border p-2 rounded" value={form.age} onChange={handleChange} />
          <input name="lithologie" placeholder="lithologie" className="border p-2 rounded" value={form.lithologie} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="code" placeholder="Code" className="border p-2 rounded" value={form.code} onChange={handleChange} />
          <input name="descript" placeholder="Descript" className="border p-2 rounded" value={form.descript} onChange={handleChange} />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/geologie')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddGeologie;
