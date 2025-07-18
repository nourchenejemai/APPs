import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import BackButton from '../../components/BackButton';
import { Plus } from 'lucide-react';


function Forages() {
  const [forages, setForages] = useState([]);
  const [form, setForm] = useState({
    abréviati: '', nom: '', nirh: '', x: '', y: '', z: '', numéro_de: '', titre_de_l: '',
    délégati: '', date_d: '', date_fin: '', profondeur: '', débit: '', rabatement: '',
    ns: '', ph: '', salinité_: '', rs: '', entreprise: '', proge: '', nature: '',
    usage: '', equip: '', utilisateu: '', typ_captag: '', crepi: '', code_nom: ''
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 50;
  const navigate = useNavigate();

  const fetchForages = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/forages?page=${page}&limit=${limit}`);
      const data = await res.json();
      setForages(data);
    } catch (error) {
      console.error("Error fetching forages:", error);
    }
  };

  const handleModifyClick = (forage) => {
    console.log("forage to edit:", forage);
    navigate('/ModifyForages', { state: { forage } });
  };

  const handleDelete = async (gid) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return; // Exit if user cancels

  try {
    const response =     await fetch(`http://localhost:8080/api/forages/${gid}`, { method: 'DELETE' });

    if (response.ok) {
      alert("Deleted successfully!");
      fetchForages(); 
    } else {
      alert("Failed to delete. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("An error occurred while deleting.");
  }
};


  useEffect(() => {
    fetchForages();
  }, [page]);

  return (
  
        <div>
          <BackButton />
          <h2 className="text-2xl font-bold mb-4">Management Forages </h2>
           <button
                onClick={() => navigate('/AddForages')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter
              </button>

        <div className="overflow-x-auto">

            <table className="min-w-[2000px] bg-white shadow rounded">            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="th p-2">ID</th>
                <th className="th p-2">abréviati</th>
                <th className="th p-2">nom</th>
                <th className="th p-2">nirh</th>
                <th className="th p-2">x</th>
                <th className="th p-2">y</th>
                <th className="th p-2">z</th>
                <th className="th p-2">numéro_de</th>
                <th className="th p-2">titre_de_l</th>
                <th className="th p-2">délégati</th>
                <th className="th p-2">date_d</th>
                <th className="th p-2">date_fin</th>
                <th className="th p-2">profondeur</th>
                <th className="th p-2">débit</th>
                <th className="th p-2">rabatement</th>
                <th className="th p-2">ns</th>
                <th className="th p-2">ph</th>
                <th className="th p-2">salinité_</th>
                <th className="th p-2">rs</th>
                <th className="th p-2">entreprise</th>
                <th className="th p-2">proge</th>
                <th className="th p-2">nature</th>
                <th className="th p-2">usage</th>
                <th className="th p-2">equip</th>
                <th className="th p-2">utilisateu</th>
                <th className="th p-2">typ_captag</th>
                <th className="th p-2">crepi</th>
                <th className="th p-2">code_nom</th>
                <th className="th p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forages.map((forage, index) => (
                <tr key={forage.gid || index} className="border-t">
                  <td className="p-2">{forage.gid}</td>
                  <td className="p-2">{forage.abréviati}</td>
                  <td className="p-2">{forage.nom}</td>
                  <td className="p-2">{forage.nirh}</td>
                  <td className="p-2">{forage.x}</td>
                  <td className="p-2">{forage.y}</td>
                  <td className="p-2">{forage.z}</td>
                  <td className="p-2">{forage.numéro_de}</td>
                  <td className="p-2">{forage.titre_de_l}</td>
                  <td className="p-2">{forage.délégati}</td>
                  <td className="p-2">{forage.date_d}</td>
                  <td className="p-2">{forage.date_fin}</td>
                  <td className="p-2">{forage.profondeur}</td>
                  <td className="p-2">{forage.débit}</td>
                  <td className="p-2">{forage.rabatement}</td>
                  <td className="p-2">{forage.ns}</td>
                  <td className="p-2">{forage.ph}</td>
                  <td className="p-2">{forage.salinité_}</td>
                  <td className="p-2">{forage.rs}</td>
                  <td className="p-2">{forage.entreprise}</td>
                  <td className="p-2">{forage.proge}</td>
                  <td className="p-2">{forage.nature}</td>
                  <td className="p-2">{forage.usage}</td>
                  <td className="p-2">{forage.equip}</td>
                  <td className="p-2">{forage.utilisateu}</td>
                  <td className="p-2">{forage.typ_captag}</td>
                  <td className="p-2">{forage.crepi}</td>
                  <td className="p-2">{forage.code___nom}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                      onClick={() => handleModifyClick(forage)}
                    >
                      ✏️
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(forage.gid)}
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
  </div>
  );
}

export default Forages;
