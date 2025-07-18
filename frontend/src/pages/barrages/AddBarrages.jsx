import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddBarrages() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    gid: '',
    geom: '',
    name: '',
    name_ar: '',
    name_fr: '',
    type_bge: '',
    gouver: '',
    code: '',
    disc: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Addbarrages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire.');
      }

      alert('Formulaire soumis avec succès!');
      setForm({
        gid: '',
        geom: '',
        name: '',
        name_ar: '',
        name_fr: '',
        type_bge: '',
        gouver: '',
        code: '',
        disc: ''
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter un Barrage</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-3 gap-4">
          <input name="name" placeholder="Nom" className="border p-2 rounded" value={form.name} onChange={handleChange} />
          <input name="name_ar" placeholder="Nom en Arabe" className="border p-2 rounded" value={form.name_ar} onChange={handleChange} />
          <input name="name_fr" placeholder="Nom en Français" className="border p-2 rounded" value={form.name_fr} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="type_bge" placeholder="Type de Barrage" className="border p-2 rounded" value={form.type_bge} onChange={handleChange} />
          <input name="gouver" placeholder="Gouvernorat" className="border p-2 rounded" value={form.gouver} onChange={handleChange} />
          <input name="code" placeholder="Code" className="border p-2 rounded" value={form.code} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1">
          <textarea name="disc" placeholder="Description" className="border p-2 rounded w-full" value={form.disc} onChange={handleChange} />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/barrage')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddBarrages;
