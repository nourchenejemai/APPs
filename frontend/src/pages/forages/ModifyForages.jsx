import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyForages() {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const selectedForage = location.state?.forage || null;
  const navigate = useNavigate();


  const [form, setForm] = useState({
    abréviati: '', nom: '', nirh: '', x: '', y: '', z: '', numéro_de: '', titre_de_l: '',
    délégati: '', date_d: '', date_fin: '', profondeur: '', débit: '', rabatement: '',
    ns: '', ph: '', salinité_: '', rs: '', entreprise: '', proge: '', nature: '',
    usage: '', equip: '', utilisateu: '', typ_captag: '', crepi: '', code___nom: ''
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedForage ) {
      console.log("Received selectedForage:", selectedForage); 
      setEditId(selectedForage.gid)
      setForm({
        abréviati: selectedForage.abréviati || '',
        nom: selectedForage.nom || '',
        nirh: selectedForage.nirh || '',
        x: selectedForage.x || '',
        y: selectedForage.y || '',
        z: selectedForage.z || '',
        numéro_de: selectedForage.numéro_de || '',
        titre_de_l: selectedForage.titre_de_l || '',
        délégati: selectedForage.délégati || '',
        date_d: selectedForage.date_d || '',
        date_fin: selectedForage.date_fin || '',
        profondeur: selectedForage.profondeur || '',
        débit: selectedForage.débit || '',
        rabatement: selectedForage.rabatement || '',
        ns: selectedForage.ns || '',
        ph: selectedForage.ph || '',
        salinité_: selectedForage.salinité_ || '',
        rs: selectedForage.rs || '',
        entreprise: selectedForage.entreprise || '',
        proge: selectedForage.proge || '',
        nature: selectedForage.nature || '',
        usage: selectedForage.usage || '',
        equip: selectedForage.equip || '',
        utilisateu: selectedForage.utilisateu || '',
        typ_captag: selectedForage.typ_captag || '',
        crepi: selectedForage.crepi || '',
        code___nom: selectedForage.code___nom || ''
      });
    }else{
          console.warn("No forage was passed in location.state");

    }
  }, [selectedForage]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!editId){
    console.error('No edit ID found. Cannot update forage.');
    alert("Impossible d'enregistrer : ID du forage manquant.");
    return;
  }
    setLoading(true);

  try {
    await fetch(`http://localhost:8080/api/forages/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Forage updated successfully!');
    navigate('/forages');
  } catch (error) {
    console.error('Error updating forage:', error);
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
          <BackButton destination='/forages' />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Modifier des Forages</h2>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
          {/* Form Rows */}
          <div className="grid grid-cols-3 gap-4">

            <input name="abréviati" placeholder="Abreviation" className="border p-2 rounded" value={form.abréviati} onChange={handleChange}  />
            <input name="nom" placeholder="Nom" className="border p-2 rounded" value={form.nom} onChange={handleChange}  />
            <input name="nirh" placeholder="NIRH" className="border p-2 rounded" value={form.nirh} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="x" placeholder="X" className="border p-2 rounded" value={form.x} onChange={handleChange}  />
            <input name="y" placeholder="Y" className="border p-2 rounded" value={form.y} onChange={handleChange}  />
            <input name="z" placeholder="Z" className="border p-2 rounded" value={form.z} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="numéro_de" placeholder="Numero" className="border p-2 rounded" value={form.numéro_de} onChange={handleChange}  />
            <input name="titre_de_l" placeholder="Titre" className="border p-2 rounded" value={form.titre_de_l} onChange={handleChange}  />
            <input name="délégati" placeholder="Delegation" className="border p-2 rounded" value={form.délégati} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="date_d" placeholder="jj/mm/aaaa" className="border p-2 rounded" value={form.date_d} onChange={handleChange}  />
            <input name="date_fin" placeholder="jj/mm/aaaa" className="border p-2 rounded" value={form.date_fin} onChange={handleChange}  />
            <input name="profondeur" placeholder="Profondeur" className="border p-2 rounded" value={form.profondeur} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="débit" placeholder="Débit" className="border p-2 rounded" value={form.débit} onChange={handleChange}  />
            <input name="rabatement" placeholder="Rabatement" className="border p-2 rounded" value={form.rabatement} onChange={handleChange}  />
            <input name="ns" placeholder="NS" className="border p-2 rounded" value={form.ns} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="ph" placeholder="pH" className="border p-2 rounded" value={form.ph} onChange={handleChange}  />
            <input name="salinité_" placeholder="Salinité" className="border p-2 rounded" value={form.salinité_} onChange={handleChange}  />
            <input name="rs" placeholder="RS" className="border p-2 rounded" value={form.rs} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="entreprise" placeholder="Entreprise" className="border p-2 rounded" value={form.entreprise} onChange={handleChange}  />
            <input name="proge" placeholder="Proge" className="border p-2 rounded" value={form.proge} onChange={handleChange}  />
            <input name="nature" placeholder="Nature" className="border p-2 rounded" value={form.nature} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="usage" placeholder="Usage" className="border p-2 rounded" value={form.usage} onChange={handleChange}  />
            <input name="equip" placeholder="Équipe" className="border p-2 rounded" value={form.equip} onChange={handleChange}  />
            <input name="utilisateu" placeholder="Utilisateur" className="border p-2 rounded" value={form.utilisateu} onChange={handleChange}  />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input name="typ_captag" placeholder="Type Captage" className="border p-2 rounded" value={form.typ_captag} onChange={handleChange} />
            <input name="crepi" placeholder="Crepi" className="border p-2 rounded" value={form.crepi} onChange={handleChange}  />
            <input name="code___nom" placeholder="Code Nom" className="border p-2 rounded" value={form.code___nom} onChange={handleChange}  />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => navigate('/forages')}
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
      </div>
  );
}

export default ModifyForages;
