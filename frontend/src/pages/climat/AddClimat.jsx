import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddClimat() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    surface: '',
    perimetre: '',
    clmide: '',
    clmnom: '',
    clmcla: '',
    clmmox: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/Addclimat', {
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
        surface: '',
        perimetre: '',
        clmide: '',
        clmnom: '',
        clmcla: '',
        clmmox: ''
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter Un Climat</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
        
        <div className="grid grid-cols-3 gap-4">
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
          <input name="clmide" placeholder="Clmide" className="border p-2 rounded" value={form.clmide} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="clmnom" placeholder="Clmnom" className="border p-2 rounded" value={form.clmnom} onChange={handleChange} />
          <input name="clmcla" placeholder="Clmcla" className="border p-2 rounded" value={form.clmcla} onChange={handleChange} />
          <input name="clmmox" placeholder="Clmmox" className="border p-2 rounded" value={form.clmmox} onChange={handleChange} />
        </div>


        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/climat')}>
            Ajouter
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default AddClimat;
