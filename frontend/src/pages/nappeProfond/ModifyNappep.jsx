import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";
import { Surface } from 'recharts';

function ModifyNappep() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedNappe = location.state?.nappe ;


     const [form, setForm] = useState({
      geom: '',
        surface: '',
        perimetre: '',
        npride: '',
        nprnom: '',
        nprcod: '',
        nprres: '',
        nprexp: '',
        nprqmi: '',
        nprqma: ''
        });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedNappe ) {
      console.log("Received selectedNappe:", selectedNappe); 
      setEditId(selectedNappe.id)
      setForm({
        geom: selectedNappe.geom || '',
        surface: selectedNappe.surface || '',
        perimetre: selectedNappe.perimetre || '',
        npride: selectedNappe.npride || '',
        nprnom: selectedNappe.nprnom || '',
        nprcod: selectedNappe.nprcod || '',
        nprres: selectedNappe.nprres || '',
        nprexp: selectedNappe.nprexp || '',
        nprqmi: selectedNappe.nprqmi || '',
        nprqma: selectedNappe.nprqma || '',
        });
    }else{
          console.warn("No nappe Profond was passed in location.state");

    }
  }, [selectedNappe]);
        
const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update Nappe Profond.');
    alert("Impossible d'enregistrer : ID du Nappe Profond manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/nappesp/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Nappe Profond updated successfully!');
    navigate('/nappepro');
  } catch (error) {
    console.error('Error updating Nappe Profond:', error);
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
          <BackButton destination='/nappepro' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier Nappe Profond</h2>


       <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
         <div className="grid grid-cols-1 gap-4">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
          </div>
        <div className="grid grid-cols-3 gap-4">
          <input name="surface" placeholder="Surface" className="border p-2 rounded" value={form.surface} onChange={handleChange} />
          <input name="perimetre" placeholder="Perimetre" className="border p-2 rounded" value={form.perimetre} onChange={handleChange} />
          <input name="npride" placeholder="nphide" className="border p-2 rounded" value={form.npride} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nprnom" placeholder="nprnom" className="border p-2 rounded" value={form.nprnom} onChange={handleChange} />
          <input name="nprcod" placeholder="nprcod" className="border p-2 rounded" value={form.nprcod} onChange={handleChange} />
          <input name="nprres" placeholder="nprres" className="border p-2 rounded" value={form.nprres} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="nprexp" placeholder="nprexp" className="border p-2 rounded" value={form.nprexp} onChange={handleChange} />
          <input name="nprqmi" placeholder="nprqmi" className="border p-2 rounded w-full" value={form.nprqmi} onChange={handleChange} />
          <input name="nprqma" placeholder="nprqma" className="border p-2 rounded w-full" value={form.nprqma} onChange={handleChange} />
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

export default ModifyNappep;
