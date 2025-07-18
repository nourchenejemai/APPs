import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';



function Geologie() {
    const [Geolog, setGeolog] = useState([]);
    const [page, setPage] = useState(1);
      const limit = 50;
      const navigate = useNavigate();
    
      const fetchGeolog= async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/geologie?page=${page}&limit=${limit}`);
          const data = await res.json();
          setGeolog(data);
        } catch (error) {
          console.error("Error fetching Geologie:", error);
        }
      };
  const handleModifyClick = (geolog) => {
    console.log("Geologie to edit:", geolog);
    navigate('/ModifyGeologie',{ state: {geolog}})
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete)return;
    try{
      const response =  await fetch(`http://localhost:8080/api/geologie/${id}`, { method: 'DELETE' });

      if (response.ok) {
            alert("Deleted successfully!");
                fetchGeolog();

          }else {
            alert("Failed to delete. Server responded with an error.");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          alert("An error occurred while deleting.");
        }
      }
  
    

  useEffect(() => {
    fetchGeolog();
  }, [page]);


  return (

        <div className='bg-gray-100 '>


            <BackButton destination='/'/>
            
                  <h2 className="  text-2xl font-bold mb-4">Management Geologie Bizerte </h2>
                  <button
                onClick={() => navigate('/AddGeologie')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter
              </button>


        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="th p-2">ID</th>
              <th className="th p-2">Superficie</th>
              <th className="th p-2">Age</th>
              <th className="th p-2">Lithologie</th>
              <th className="th p-2">Code</th>
              <th className="th p-2">Descript</th>
              <th className="th p-2">Actions</th>



    </tr>
    </thead>
    <tbody>
            {Geolog.map((geolog, index) => (
              <tr key={geolog.id || index} className="border-t">
                <td className="p-2">{geolog.id}</td>
                <td className="p-2">{geolog.superficie}</td>
                <td className="p-2">{geolog.age}</td>
                <td className="p-2">{geolog.lithologie}</td>
                <td className="p-2">{geolog.code}</td>
                <td className="p-2">{geolog.descript}</td>
                

                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => handleModifyClick(geolog)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(geolog.id)}
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

export default Geologie;