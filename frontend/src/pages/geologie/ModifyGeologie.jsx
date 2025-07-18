import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyGeologie() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedGeolog = location.state?.geolog || {};


     const [form, setForm] = useState({
        geom:'',
        superficie: '',
        age: '',
        lithologie: '',
        code: '',
        descript: ''
        });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedGeolog ) {
      console.log("Received selectedGeolog:", selectedGeolog); 
      setEditId(selectedGeolog.id)
      setForm({
        geom: selectedGeolog.geom || '',
        superficie: selectedGeolog.superficie || '',
        age: selectedGeolog.age || '',
        lithologie: selectedGeolog.lithologie || '',
        code: selectedGeolog.code || '',
        descript: selectedGeolog.descript || '',
       
        });
    }else{
          console.warn("No Geologie was passed in location.state");

    }
  }, [selectedGeolog]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Geologie.');
    alert("Impossible d'enregistrer : ID du Geologie manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/geologie/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(form),
    });
    alert('Geologie updated successfully!');
    navigate('/climat');
  } catch (error) {
    console.error('Error updating Geologie:', error);
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
          <BackButton destination='/geologie' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Geologie</h2>


        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
            <input name="superficie" placeholder="Superficie" className="border p-2 rounded" value={form.superficie} onChange={handleChange} />

          </div>
        
          <div className="grid grid-cols-2 gap-4">
          <input name="age" placeholder="Age" className="border p-2 rounded" value={form.age} onChange={handleChange} />
          <input name="lithologie" placeholder="lithologie" className="border p-2 rounded" value={form.lithologie} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="code" placeholder="Code" className="border p-2 rounded" value={form.code} onChange={handleChange} />
          <input name="descript" placeholder="Descript" className="border p-2 rounded" value={form.descript} onChange={handleChange} />
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

export default ModifyGeologie;
