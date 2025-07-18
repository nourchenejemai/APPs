import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyClimat() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedClimat = location.state?.climat || {};


     const [form, setForm] = useState({
      geom:'',
        surface: '',
        perimetre: '',
        clmide: '',
        clmnom: '',
        clmcla: '',
        clmmox: ''
        });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedClimat ) {
      console.log("Received selectedClimat:", selectedClimat); 
      setEditId(selectedClimat.id)
      setForm({
        geom: selectedClimat.geom || '',
        surface: selectedClimat.surface || '',
        perimetre: selectedClimat.perimetre || '',
        clmide: selectedClimat.clmide || '',
        clmnom: selectedClimat.clmnom || '',
        clmcla: selectedClimat.clmcla || '',
        clmmox: selectedClimat.clmmox || '',
       
        });
    }else{
          console.warn("No Climat was passed in location.state");

    }
  }, [selectedClimat]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Climat.');
    alert("Impossible d'enregistrer : ID du Climat manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/climat/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(form),
    });
    alert('Climat updated successfully!');
    navigate('/climat');
  } catch (error) {
    console.error('Error updating Climat:', error);
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
          <BackButton destination='/climat' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Climat</h2>


        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        
          <div className="grid grid-cols-3 gap-4">
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface ?? ''} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
          <input name="clmide" placeholder="Clmide" className="border p-2 rounded" value={form.clmide} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="clmnom" placeholder="Clmnom" className="border p-2 rounded" value={form.clmnom} onChange={handleChange} />
          <input name="clmcla" placeholder="Clmcla" className="border p-2 rounded" value={form.clmcla} onChange={handleChange} />
          <input name="clmmox" placeholder="Clmmoc" className="border p-2 rounded" value={form.clmmox} onChange={handleChange} />
        </div>
      

        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyClimat;
