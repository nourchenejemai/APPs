import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddNappeph() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    geom: '',
    surface: '',
    perimetre: '',
    nphide: '',
    nphnom: '',
    nphcod: '',
    nphres: '',
    nphexp: '',
    nphqmi: '',
    nphqma: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/AddNappePh', {
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
        nphide: '',
        nphnom: '',
        nphcod: '',
        nphres: '',
        nphexp: '',
        nphqmi: '',
        nphqma: ''
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
          <BackButton destination='/' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Un Nappe Phreatique</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-3 gap-4">
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
          <input name="nphide" placeholder="nphide" className="border p-2 rounded" value={form.nphide} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nphnom" placeholder="nphnom" className="border p-2 rounded" value={form.nphnom} onChange={handleChange} />
          <input name="nphcod" placeholder="nphcod" className="border p-2 rounded" value={form.nphcod} onChange={handleChange} />
          <input name="nphres" placeholder="nphres" className="border p-2 rounded" value={form.nphres} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nphexp" placeholder="nphexp" className="border p-2 rounded" value={form.nphexp} onChange={handleChange} />
          <input name="nphqmi" placeholder="nphqmi" className="border p-2 rounded w-full" value={form.nphqmi} onChange={handleChange} />
          <input name="nphqma" placeholder="nphqma" className="border p-2 rounded w-full" value={form.nphqma} onChange={handleChange} />


        </div>
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/nappes')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddNappeph;
