import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyVertisol() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedVert = location.state?.vert ;


     const [form, setForm] = useState({
      geom: '',
      couleur:'', 
      typecoul: ''
       });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedVert ) {
      console.log("Received selectedVertisol:", selectedVert); 
      setEditId(selectedVert.id)
      setForm({
       
        geom: selectedVert.geom || '',

        couleur: selectedVert.couleur || '',
        typecoul: selectedVert.typecoul || '',

        });
    }else{
          console.warn("No Vertisol was passed in location.state");

    }
  }, [selectedVert]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Vertisol.');
    alert("Impossible d'enregistrer : ID du Vertisol manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/vertisols/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Vertisol updated successfully!');
    navigate('/vertisol');
  } catch (error) {
    console.error('Error updating Vertisol:', error);
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
          <BackButton destination='/vertisol' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Vertisol</h2>


        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          
       
        <div className="grid grid-cols-1 gap-2">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
         
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <input name="couleur" placeholder="Couleur" className="border p-2 rounded" value={form.couleur} onChange={handleChange} />
          
        </div>

          <div className="grid grid-cols-1 gap-2">
          <input name="typec" placeholder="Type" className="border p-2 rounded" value={form.typecoul} onChange={handleChange} />
         
        </div>
        
      

        <div className="text-center">
           <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() =>navigate('/vertisol')}>
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyVertisol;
