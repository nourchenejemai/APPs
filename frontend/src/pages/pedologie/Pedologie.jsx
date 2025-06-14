import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';


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
    await fetch(`http://localhost:8080/api/pedologie/${id}`, { method: 'DELETE' });
    fetchNappep();
  };
    

  useEffect(() => {
    fetchPed();
  }, [page]);


  return (
    
        <div className='bg-gray-100'>
          <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Pedologie </h2>


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