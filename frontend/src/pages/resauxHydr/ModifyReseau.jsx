import React, { useEffect,useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function ModifyReseau() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedReseau = location.state?.reseau ;

  const [form, setForm] = useState({
    id: '',
    geom:'',
    longeur: '',
    hylide: '',
    hyltyp: '',
    hylnom: ''

  });
  const [editId, setEditId] = useState(null);
  

 useEffect(() => {
     if (selectedReseau ) {
       console.log("Received selectedReseau:", selectedReseau); 
       setEditId(selectedReseau.id)
       setForm({
        
         geom: selectedReseau.geom || '',
         longeur: selectedReseau.longeur || '',
         hylide: selectedReseau.hylide || '',
        hyltyp: selectedReseau.hyltyp || '',
         hylnom: selectedReseau.hylnom || '',
         

 
         });
     }else{
           console.warn("No Reseaux hydrographique was passed in location.state");
 
     }
   }, [selectedReseau]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!editId){
    console.error('No edit ID found. Cannot update Reseaux Hydrographiques.');
    alert("Impossible d'enregistrer : ID du Reseaux Hydrographiques manquant.");
    return;
  }
    setLoading(true);

    try {
      await fetch(`http://localhost:8080/api/reseauHydr/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Reseaux Hydrographiques updated successfully!');
    navigate('/reseau');
  } catch (error) {
    console.error('Error updating Reseaux Hydrographiques:', error);
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
          <BackButton destination='/reseaux' />
          </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Modifier Reseau Hydrographique</h2>
      <form onSubmit={handleSubmit} className=" bg-white p-4 rounded shadow-md space-y-4">
        
       <div className="grid grid-cols-1 gap-2">
          <input name="geom" placeholder="Geometry" className="border p-2 rounded" value={form.geom} onChange={handleChange} />
         
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <input name="longeur" placeholder="Longeur" className="border p-2 rounded" value={form.longeur} onChange={handleChange} />
          
        </div>
        
          <div className="grid grid-cols-1 gap-2">
          <input name="hylide" placeholder="Ide resaux hydrographiques" className="border p-2 rounded" value={form.hylide} onChange={handleChange} />
         
        </div>

          <div className="grid grid-cols-1 gap-2">
          <input name="hyltyp" placeholder="Type resaux hydrographiques" className="border p-2 rounded" value={form.hyltyp} onChange={handleChange} />
         
        </div>

          <div className="grid grid-cols-1 gap-2">
          <input name="hylnom" placeholder="Nom resaux hydrographiques" className="border p-2 rounded" value={form.hylnom} onChange={handleChange} />
         
        </div>
        
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          onClick={()=> navigate('/reseaux')}>
            Enregistrer les modifications
          </button>
        </div>

      </form>
    </div>
    </div>
  );
}

export default ModifyReseau;
