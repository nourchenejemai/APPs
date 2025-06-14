import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';


function Vertisol() {
    const [Vertisol, setVertisol] = useState([]);
    const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
      const fetchVertisol= async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/vertisols?page=${page}&limit=${limit}`);
      const data = await res.json();
      setVertisol(data);
    } catch (error) {
      console.error("Error fetching Vertisol:", error);
    }
  };
  const handleModifyClick = (vert) => {
    console.log("Vertisol to edit:", vert);
    navigate('/ModifyVertisol',{ state: {vert}})
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/vertisols/${id}`, { method: 'DELETE' });
    fetchVertisol();
  };
    

  useEffect(() => {
    fetchVertisol();
  }, [page]);


  return (
    
        <div className='bg-gray-100'>
          <BackButton />
      <h2 className="text-2xl font-bold mb-4">Management Vertisol </h2>


        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="th p-2">ID</th>
              <th className="th p-2">COULEUR</th>
              <th className="th p-2">TypeCouleur</th>
              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {Vertisol.map((verti, index) => (
              <tr key={verti.id || index} className="border-t">
                <td className="p-2">{verti.id}</td>
                
                <td className="p-2">{verti.couleur}</td>
                <td className="p-2">{verti.typecoul}</td>

                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(verti)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(verti.id)}
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
export default Vertisol;