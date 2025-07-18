import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddDelegation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    geom: '',
    object: '',
    altnamef: '',
    reftncod: '',
    codegouv: '',
    nomgouv: '',
    shapeleng: '',
    shapearea: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Adddelegation', {
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
        object: '',
        altnamef: '',
        reftncod: '',
        codegouv: '',
        nomgouv: '',
        shapeleng: '',
        shapearea: ''
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
          <BackButton destination='/delegation' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Delegation</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
          <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-3 gap-4">
          <input name="object" placeholder="Object" className="border p-2 rounded" value={form.object} onChange={handleChange} />
          <input name="altnamef" placeholder="Altnamef" className="border p-2 rounded" value={form.altnamef} onChange={handleChange} />
          <input name="reftncod" placeholder="Reftncod" className="border p-2 rounded" value={form.reftncod} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="codegouv" placeholder="Codegouv" className="border p-2 rounded" value={form.codegouv} onChange={handleChange} />
          <input name="nomgouv" placeholder="Nomgouv" className="border p-2 rounded" value={form.nomgouv} onChange={handleChange} />
          <input name="shapeleng" placeholder="Shapeleng" className="border p-2 rounded" value={form.shapeleng} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <input name="shapearea" placeholder="Shapearea" className="border p-2 rounded" value={form.shapearea} onChange={handleChange} />
          </div>


        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/delegation')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddDelegation;
