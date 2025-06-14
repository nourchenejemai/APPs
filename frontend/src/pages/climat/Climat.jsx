import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';



function Climat() {
    const [Climat, setClimat] = useState([]);
    const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
      const fetchClimat= async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/climat?page=${page}&limit=${limit}`);
          const data = await res.json();
          setClimat(data);
        } catch (error) {
          console.error("Error fetching Climat:", error);
        }
      };
  const handleModifyClick = (climat) => {
    console.log("Climat to edit:", climat);
    navigate('/ModifyClimat',{ state: {climat}})
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/climat/${id}`, { method: 'DELETE' });
    fetchClimat();
  };
    

  useEffect(() => {
    fetchClimat();
  }, [page]);


  return (

        <div className='bg-gray-100 '>


            <BackButton />
            
                  <h2 className="  text-2xl font-bold mb-4">Management Climat Bizerte </h2>
                  <button
                onClick={() => navigate('/AddClimat')}
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
              <th className="th p-2">CLMide</th>
              <th className="th p-2">CLMnom</th>
              <th className="th p-2">CLMcla</th>
              <th className="th p-2">CLMmox</th>
              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {Climat.map((climat, index) => (
              <tr key={climat.id || index} className="border-t">
                <td className="p-2">{climat.id}</td>
                <td className="p-2">{climat.surface}</td>
                <td className="p-2">{climat.perimetre}</td>
                <td className="p-2">{climat.clmide}</td>
                <td className="p-2">{climat.clmnom}</td>
                <td className="p-2">{climat.clmcla}</td>
                <td className="p-2">{climat.clmmox}</td>
                

                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(climat)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(climat.id)}
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

export default Climat;