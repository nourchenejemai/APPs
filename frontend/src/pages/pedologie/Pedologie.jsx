import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';


function Pedologie() {
    const [ped, setPed] = useState([]);
    const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
      const fetchPed= async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/pedologie?page=${page}&limit=${limit}`);
      const data = await res.json();
      setPed(data);
    } catch (error) {
      console.error("Error fetching Pedologie:", error);
    }
  };
  const handleModifyClick = (ped) => {
    console.log("Pedologie to edit:", ped);
    navigate('/ModifyPed',{ state: {ped}})
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return; // Exit if user cancels

  try {
    const response =  await fetch(`http://localhost:8080/api/pedologie/${id}`, { method: 'DELETE' });


    if (response.ok) {
      alert("Deleted successfully!");
    fetchNappep(); 
      } else {
      alert("Failed to delete. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("An error occurred while deleting.");
  }
};

    

  useEffect(() => {
    fetchPed();
  }, [page]);


  return (
    
        <div className='bg-gray-100'>
          <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Pedologie </h2>
<button
                onClick={() => navigate('/Addpedologie')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter
              </button>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="th p-2">ID</th>
                <th className="th p-2">CODE</th>
              <th className="th p-2">SURFACE</th>
              <th className="th p-2">PERIMETRE</th>
              <th className="th p-2">COULEUR</th>
              <th className="th p-2">ROCHEME</th>
              <th className="th p-2">TEXTURE</th>
              <th className="th p-2">SALURE</th>
             <th className="th p-2">ACTEAU</th>
              <th className="th p-2">CHARGCA</th>
              <th className="th p-2">PROFOND</th>
              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {ped.map((pedo, index) => (
              <tr key={pedo.id || index} className="border-t">
                <td className="p-2">{pedo.id}</td>
                <td className="p-2">{pedo.code}</td>
                <td className="p-2">{pedo.surface}</td>
                <td className="p-2">{pedo.perimetre}</td>
                <td className="p-2">{pedo.couleur}</td>
                <td className="p-2">{pedo.rocheme}</td>
                <td className="p-2">{pedo.texture}</td>
                <td className="p-2">{pedo.salure}</td>
                <td className="p-2">{pedo.acteau}</td>
                <td className="p-2">{pedo.chargca}</td>
                <td className="p-2">{pedo.profond}</td>

                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(pedo)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(pedo.id)}
                  >
                    🗑️
                  </button>
                </td>



                </tr>
                ))}
        </tbody>
    </table>
    
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={() => setPage((page) => Math.max(page - 1, 1))}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            ⬅️ Préc
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((page) => page + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Suivante ➡️
          </button>
 </div>
    </div>
  )
}
export default Pedologie;