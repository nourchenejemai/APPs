import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';

function Barrages() {
  const [barrages, setBarrages] = useState([]);
  const [form, setForm] = useState({ name: '', name_ar: '', name_fr: '', type_bge: '', gouver: '', code: '', disc: '' });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 50;
  const navigate = useNavigate();



  const fetchBarrages = async () => {
    try{
    const res = await fetch('http://localhost:8080/api/barrages?page=${page}&limit=${limit}');
    const data = await res.json();
    setBarrages(data);
  }catch (error) {
    console.error("Error fetching Barrages:", error);
  }
}


  const handleModifyClick = (barrage) => {
    console.log("Barrage to edit:", barrage);
    navigate('/ModifyBarrage', { state: { barrage } });
  };

 const handleDelete = async (gid) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return; // Exit if user cancels

  try {
    const response = await fetch(`http://localhost:8080/api/barrages/${gid}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Deleted successfully!");
      fetchBarrages(); // Refresh list
    } else {
      alert("Failed to delete. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("An error occurred while deleting.");
  }
};

  useEffect(() => {
    fetchBarrages();
  }, [page]);

  return (

    <div className='bg-gray-100'>
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Barrages </h2>
       <button
      onClick={() => navigate('/Addbarrages')}
      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
    >
      <Plus className="w-5 h-5 mr-2" />
      Ajouter
    </button>



      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="th p-2">ID</th>
            <th className="th p-2">Nom</th>
            <th className="th p-2">Nom_Ar</th>
            <th className="th p-2">Nom_Fr</th>
            <th className="th p-2">Type</th>
            <th className="th p-2">Gouvernorat</th>
            <th className="th p-2">Code</th>
            <th className="th p-2">Description</th>
            <th className="th p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {barrages.map((barrage, index) => (
            <tr key={barrage.gid || index} className="border-t">
              <td className="p-2">{barrage.gid}</td>
              <td className="p-2">{barrage.name}</td>
              <td className="p-2">{barrage.name_ar}</td>
              <td className="p-2">{barrage.name_fr}</td>
              <td className="p-2">{barrage.type_bge}</td>
              <td className="p-2">{barrage.gouver}</td>
              <td className="p-2">{barrage.code}</td>
              <td className="p-2">{barrage.disc}</td>
              <td className="p-2 space-x-2">
                <button className="bg-yellow-400 text-white px-2 py-1 rounded" onClick={() => handleModifyClick(barrage)}>✏️</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(barrage.gid)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-4 my-4">
        <button onClick={() => setPage(page => Math.max(page - 1, 1))} className="px-3 py-1 bg-gray-300 rounded">⬅️ Préc</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page => page + 1)} className="px-3 py-1 bg-gray-300 rounded">Suivante ➡️</button>
      </div>
    </div>

  );
}

export default Barrages;