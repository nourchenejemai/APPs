import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddNappep() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    grom: '',
    surface: '',
    perimetre: '',
    npride: '',
    nprnom: '',
    nprcod: '',
    nprres: '',
    nprexp: '',
    nprqmi: '',
    nprqma: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Addnappep', {
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
        geom: '',
        surface: '',
        perimetre: '',
        npride: '',
        nprnom: '',
        nprcod: '',
        nprres: '',
        nprexp: '',
        nprqmi: '',
        nprqma: ''
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
          <BackButton destination='/nappepro' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Un Nappe Profond</h2>
      
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
         <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-3 gap-4">
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
          <input name="npride" placeholder="nphide" className="border p-2 rounded" value={form.npride} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nprnom" placeholder="nprnom" className="border p-2 rounded" value={form.nprnom} onChange={handleChange} />
          <input name="nprcod" placeholder="nprcod" className="border p-2 rounded" value={form.nprcod} onChange={handleChange} />
          <input name="nprres" placeholder="nprres" className="border p-2 rounded" value={form.nprres} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nprexp" placeholder="nprexp" className="border p-2 rounded" value={form.nprexp} onChange={handleChange} />
          <input name="nprqmi" placeholder="nprqmi" className="border p-2 rounded w-full" value={form.nprqmi} onChange={handleChange} />
          <input name="nprqma" placeholder="nprqma" className="border p-2 rounded w-full" value={form.nprqma} onChange={handleChange} />


        </div>
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/nappepro')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddNappep;
