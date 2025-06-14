import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";
import { Surface } from 'recharts';

function ModifyNappeph() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedBarrage = location.state?.barrage ;


     const [form, setForm] = useState({
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
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedBarrage ) {
      console.log("Received selectedBarrage:", selectedBarrage); 
      setEditId(selectedBarrage.gid)
      setForm({
        surface: selectedBarrage.surface || '',
        perimetre: selectedBarrage.perimetre || '',
        nphide: selectedBarrage.nphide || '',
        nphnom: selectedBarrage.nphnom || '',
        nphcod: selectedBarrage.nphcod || '',
        nphres: selectedBarrage.nphres || '',
        nphexp: selectedBarrage.nphexp || '',
        nphqma: selectedBarrage.nphqma || '',
        });
    }else{
          console.warn("No nappe Phreatique was passed in location.state");

    }
  }, [selectedBarrage]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update nappe Ph.');
    alert("Impossible d'enregistrer : ID du nappe Ph manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/nappes/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Nappe Ph updated successfully!');
    navigate('/nappes');
  } catch (error) {
    console.error('Error updating Nappe Ph:', error);
  }finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

 
  return (
    <div className="pt-24 px-6 text-gray-800">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">Modifier des Nappes Phreatique</h2>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          
        
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

        <div className="grid grid-cols-1">
          <input name="nphexp" placeholder="nphexp" className="border p-2 rounded" value={form.nphexp} onChange={handleChange} />
          <input name="nphqmi" placeholder="nphqmi" className="border p-2 rounded w-full" value={form.nphqmi} onChange={handleChange} />
          <input name="nphqma" placeholder="nphqma" className="border p-2 rounded w-full" value={form.nphqma} onChange={handleChange} />


        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/nappes')}
          >
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
  );
}

export default ModifyNappeph;
