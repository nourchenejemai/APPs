import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyBarrage() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedBarrage = location.state?.barrage ;


     const [form, setForm] = useState({
        name: '',
        name_ar: '',
        name_fr: '',
        type_bge: '',
        gouver: '',
        code: '',
        disc: '',
        geom: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedBarrage ) {
      console.log("Received selectedBarrage:", selectedBarrage); 
      setEditId(selectedBarrage.gid)
      setForm({
        name: selectedBarrage.name || '',
        name_ar: selectedBarrage.name_ar || '',
        name_fr: selectedBarrage.name_fr || '',
        type_bge: selectedBarrage.type_bge || '',
        gouver: selectedBarrage.gouver || '',
        code: selectedBarrage.code || '',
        disc: selectedBarrage.disc || '',
        geom: selectedBarrage.geom || '',
        });
    }else{
          console.warn("No  barrage was passed in location.state");

    }
  }, [selectedBarrage]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Barrage.');
    alert("Impossible d'enregistrer : ID du Barrage manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/barrages/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Barrage updated successfully!');
    navigate('/barrage');
  } catch (error) {
    console.error('Error updating Barrage:', error);
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
        <BackButton destination='/barrage'/>
        </div>
        <h2 className="text-2xl font-bold mb-4">Modifier des Barrages</h2>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          
        
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
          <input name="geom" placeholder="Geom" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          <textarea name="disc" placeholder="Description" className="border p-2 rounded w-full" value={form.disc} onChange={handleChange} />

        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/barrage')}
          >
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyBarrage;
