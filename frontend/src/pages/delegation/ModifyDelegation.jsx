import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyDelegation() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDel = location.state?.del || {};


     const [form, setForm] = useState({
         geom: '',
        object: '',
        altnamef: '',
        reftncod: '',
        codegouv: '',
        nomgouv: '',
        shapeleng: '',
        shapearea: ''
        });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedDel ) {
      console.log("Received selectedDelegation:", selectedDel); 
      setEditId(selectedDel.id)
      setForm({
        geom: selectedDel.geom || '',
        object: selectedDel.objectb || '',
        altnamef: selectedDel.altnamef || '',
        reftncod: selectedDel.reftncod || '',
        codegouv: selectedDel.codegouv || '',
        nomgouv: selectedDel.nomgouv || '',
        shapeleng: selectedDel.shapeleng || '',
        shapearea: selectedDel.shapearea || '',

       
        });
    }else{
          console.warn("No Delegation was passed in location.state");

    }
  }, [selectedDel]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Delegation.');
    alert("Impossible d'enregistrer : ID du Delegation manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/delegation/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(form),
    });
    alert('Delegation updated successfully!');
    navigate('/delegation');
  } catch (error) {
    console.error('Error updating Delegation:', error);
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
          <BackButton destination='/delegation' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Delegation</h2>


        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
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
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyDelegation;
