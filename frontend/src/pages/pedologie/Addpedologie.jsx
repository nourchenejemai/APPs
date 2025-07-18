import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function Addpedologie() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    geom: '',
    code:'', 
      surface:'', 
      perimetre:'', 
      couleur:'', 
      rocheme:'', 
      texture:'', 
      salure:'',
      acteau:'', 
      chargca:'', 
      profond:''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Addpedologie', {
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
      code:'', 
      surface:'', 
      perimetre:'', 
      couleur:'', 
      rocheme:'', 
      texture:'', 
      salure:'',
      acteau:'', 
      chargca:'', 
      profond:''
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
          <BackButton destination='/pedologie' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Pedologie</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
        
       <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input name="code" placeholder="Code" className="border p-2 rounded" value={form.code} onChange={handleChange} />
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="couleur" placeholder="Couleur" className="border p-2 rounded" value={form.couleur} onChange={handleChange} />
          <input name="rocheme" placeholder="Rocheme" className="border p-2 rounded" value={form.rocheme} onChange={handleChange} />
          <input name="texture" placeholder="Texture" className="border p-2 rounded" value={form.texture} onChange={handleChange} />
        </div>

          <div className="grid grid-cols-3 gap-4">
          <input name="salure" placeholder="Salure" className="border p-2 rounded" value={form.salure} onChange={handleChange} />
          <input name="acteau" placeholder="Acteau" className="border p-2 rounded w-full" value={form.acteau} onChange={handleChange} />
          <input name="chargca" placeholder="Chargca" className="border p-2 rounded w-full" value={form.chargca} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <input name="profond" placeholder="Profond" className="border p-2 rounded" value={form.profond} onChange={handleChange} />
          </div>
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/pedologie')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default Addpedologie;
