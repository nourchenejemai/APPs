import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';


function Nappe_Ph() {
    const [nappesPh, setNappePh] = useState([]);
        const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
    const fetchNappePh= async () => {
      try {
      const res = await fetch(`http://localhost:8080/api/nappes?page=${page}&limit=${limit}`);
      const data = await res.json();
      setNappePh(data);
    } catch (error) {
      console.error("Error fetching NappePh:", error);
    }
  };
  const handleModifyClick = (nappe) => {
    console.log("Nappe Phreatique to edit:", nappe);
    navigate('/ModifyNappeph',{ state: {nappe}})
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return; // Exit if user cancels

  try {
    const response =     await fetch(`http://localhost:8080/api/nappes/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert("Deleted successfully!");
    fetchNappePh();
    } else {
      alert("Failed to delete. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("An error occurred while deleting.");
  }
};


  useEffect(() => {
    fetchNappePh();
  }, [page]);


  return (
    
        <div className='bg-gray-100'>
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Nappe Phreatique </h2>
   <button
                onClick={() => navigate('/AddNappeph')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter
              </button>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="th p-2">ID</th>
              <th className="th p-2">SURFACE</th>
              <th className="th p-2">PERIMETRE</th>
              <th className="th p-2">NPH_IDE</th>
              <th className="th p-2">NPH_NOM</th>
              <th className="th p-2">NPH_COD</th>
              <th className="th p-2">NPH_RES</th>
             <th className="th p-2">NPH_EXP</th>
              <th className="th p-2">NPH_QMI</th>
              <th className="th p-2">NPH_QMA</th>
              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {nappesPh.map((nappe, index) => (
              <tr key={nappe.id || index} className="border-t">
                <td className="p-2">{nappe.id}</td>
                <td className="p-2">{nappe.surface}</td>
                <td className="p-2">{nappe.perimetre}</td>
                <td className="p-2">{nappe.nphide}</td>
                <td className="p-2">{nappe.nphnom}</td>
                <td className="p-2">{nappe.nphcod}</td>
                <td className="p-2">{nappe.nphres}</td>
                <td className="p-2">{nappe.nphexp}</td>
                <td className="p-2">{nappe.nphqmi}</td>
                <td className="p-2">{nappe.nphqma}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(nappe)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(nappe.id)}
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

export default Nappe_Ph