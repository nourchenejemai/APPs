import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";
import { Surface } from 'recharts';

function ModifyPed() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPed = location.state?.ped ;


     const [form, setForm] = useState({
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
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedPed ) {
      console.log("Received selectedNappe:", selectedPed); 
      setEditId(selectedPed.id)
      setForm({
        code: selectedPed.code || '',
        surface: selectedPed.surface || '',
        perimetre: selectedPed.perimetre || '',
        couleur: selectedPed.couleur || '',
        rocheme: selectedPed.rocheme || '',
        texture: selectedPed.texture || '',
        salure: selectedPed.salure || '',
        acteau: selectedPed.acteau || '',
        chargca: selectedPed.chargca || '',
        profond: selectedPed.profond || '',
        });
    }else{
          console.warn("No Pedologie was passed in location.state");

    }
  }, [selectedPed]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Pedologie.');
    alert("Impossible d'enregistrer : ID du Pedologie manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/pedologie/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Pedologie updated successfully!');
    navigate('/pedologie');
  } catch (error) {
    console.error('Error updating Pedologie:', error);
  }finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

 
  return (
<div className="min-h-screen pt-8 px-6 bg-blue-400 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-6">
          <BackButton destination='/pedologie' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Pedologie</h2>


        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          
        
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
           <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() =>navigate('/pedologie')}>
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyPed;
