import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';


function ReseauxHydr() {
    const [Reseau, setReseauhydr] = useState([]);
    const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
      const fetchReseauHydr= async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reseauHydr?page=${page}&limit=${limit}`);
      const data = await res.json();
      setReseauhydr(data);
    } catch (error) {
      console.error("Error fetching Reseaux Hydrographiques:", error);
    }
  };
  const handleModifyClick = (reseau) => {
    console.log("Reseaux Hydrographiques to edit:", reseau);
    navigate('/ModifyReseau',{ state: {reseau}})
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return; 

  try {
    const response = await fetch(`http://localhost:8080/api/reseauHydr/${id}`, { method: 'DELETE' });


    if (response.ok) {
      alert("Deleted successfully!");
          fetchReseauHydr();
    } else {
      alert("Failed to delete. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("An error occurred while deleting.");
  }
};
const handleSearchById = async (id) => {
  if (!id) {
    fetchReseauHydr(); // reset to paginated list
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/reseauHydr/${id}`);
    const data = await res.json();

    if (data.message === "Reseau hydrographique not found") {
      setReseauhydr([]); // Clear if not found
    } else {
      setReseauhydr([data]); // Show single item as array
    }
  } catch (error) {
    console.error("Error searching by ID:", error);
  }
};


    
    

  useEffect(() => {
    fetchReseauHydr();
    
  }, [page]);


  return (
    
        <div className='bg-gray-100'>
          <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Reseaux Hydrographiques </h2>
      <div className="flex justify-between items-center mb-4">
         
          <button
                onClick={() => navigate('/AddReseau')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter
              </button>
               {/* Search by ID */}
          <input
            type="number"
            placeholder="Rechercher par ID..."
            className="border border-gray-300 rounded px-3 py-2 shadow-sm"
            onChange={(e) => handleSearchById(e.target.value)}
          />
              </div>


        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="th p-2">ID</th>
              <th className="th p-2">Longeur</th>
              <th className="th p-2">hylIDE</th>
              <th className="th p-2">hylTYPE</th>
              <th className="th p-2">hylnom</th>

              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {Reseau.map((reseau, index) => (
              <tr key={reseau.id || index} className="border-t">
                <td className="p-2">{reseau.id}</td>
                
                <td className="p-2">{reseau.longeur}</td>
                <td className="p-2">{reseau.hylide}</td>
                <td className="p-2">{reseau.hyltyp}</td>
                <td className="p-2">{reseau.hylnom}</td>



                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(reseau)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(reseau.id)}
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


export default ReseauxHydr