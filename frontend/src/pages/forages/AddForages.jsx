import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function AddForages() {

  const [forages, setForages] = useState([]);
  const [form, setForm] = useState({ abréviati: '', nom: '', nirh: '', x: '', y: '', z: '', numéro_de: '', titre_de_l: '', délégati: '', date_d: '', date_fin: '', profondeur: '', débit: '', rabatement: '', ns: '', ph: '', salinité_: '', rs: '', entreprise: '', proge: '', nature: '', usage: '', equip: '', utilisateu: '', typ_captag: '', crepi: '', code___nom: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();


  const fetchForages = async () => {
    const res = await fetch('http://localhost:8080/api/forages?page=${page}&limit=500');
    const data = await res.json();
    setForages(data);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/Addforages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: parseInt(form.type) }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du formulaire.');
    }

    alert('Formulaire soumis avec succès!');
    setForm({ abréviati: '', nom: '', nirh: '', x: '', y: '', z: '', numéro_de: '', titre_de_l: '', délégati: '', date_d: '', date_fin: '', profondeur: '', débit: '', rabatement: '', ns: '', ph: '', salinité_: '', rs: '', entreprise: '', proge: '', nature: '', usage: '', equip: '', utilisateu: '', typ_captag: '', crepi: '', code___nom: '' });
    setEditId(null);
    fetchForages();
  };


  return (
      
      <div className="min-h-screen pt-8 px-6 bg-blue-400 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-6">
        <BackButton destination='/forages' />
        </div>

          <h2 className="text-2xl font-bold mb-4">Ajouter des Forages </h2>
          <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="abréviati" placeholder="Abreviation" className="border p-2 rounded" value={form.abréviati} onChange={handleChange} required />
              <input name="nom" placeholder="Nom" className="border p-2 rounded" value={form.nom} onChange={handleChange} required />
              <input name="nirh" placeholder="NIRH" className="border p-2 rounded" value={form.nirh} onChange={handleChange} required />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="x" placeholder="X" className="border p-2 rounded" value={form.x} onChange={handleChange} required />
              <input name="y" placeholder="Y" className="border p-2 rounded" value={form.y} onChange={handleChange} required />
              <input name="z" placeholder="Z" className="border p-2 rounded" value={form.z} onChange={handleChange} required />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="numéro_de" placeholder="Numero" className="border p-2 rounded" value={form.numéro_de} onChange={handleChange} required />
              <input name="titre_de_l" placeholder="Titre" className="border p-2 rounded" value={form.titre_de_l} onChange={handleChange} required />
              <input name="délégati" placeholder="Delegation" className="border p-2 rounded" value={form.délégati} onChange={handleChange} required />
            </div>

            {/* Row 4 
              <DatePicker
                selected={form.date_d}
                onChange={(date) => setForm({ ...form, date_d: date })}
                className="border p-2 rounded"
                placeholderText="Date Début"
              />

              <DatePicker
                selected={form.date_fin}
                onChange={(date) => setForm({ ...form, date_fin: date })}
                className="border p-2 rounded"
                placeholderText="Date Fin"
              />*/}
            <div className="grid grid-cols-3 gap-4">

              <input name="date_d" placeholder="jj/mm/aaaa" className="border p-2 rounded" value={form.date_d} onChange={handleChange} required />
              <input name="date_fin" placeholder="jj/mm/aaaa" className="border p-2 rounded" value={form.date_fin} onChange={handleChange} required />

              <input name="profondeur" placeholder="Profondeur" className="border p-2 rounded" value={form.profondeur} onChange={handleChange} required />
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="débit" placeholder="Débit" className="border p-2 rounded" value={form.débit} onChange={handleChange} required />
              <input name="rabatement" placeholder="Rabatement" className="border p-2 rounded" value={form.rabatement} onChange={handleChange} required />
              <input name="ns" placeholder="NS" className="border p-2 rounded" value={form.ns} onChange={handleChange} required />
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="ph" placeholder="pH" className="border p-2 rounded" value={form.ph} onChange={handleChange} required />
              <input name="salinité_" placeholder="Salinité" className="border p-2 rounded" value={form.salinité_} onChange={handleChange} required />
              <input name="rs" placeholder="RS" className="border p-2 rounded" value={form.rs} onChange={handleChange} required />
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="entreprise" placeholder="Entreprise" className="border p-2 rounded" value={form.entreprise} onChange={handleChange} required />
              <input name="proge" placeholder="Proge" className="border p-2 rounded" value={form.proge} onChange={handleChange} required />
              <input name="nature" placeholder="Nature" className="border p-2 rounded" value={form.nature} onChange={handleChange} required />
            </div>

            {/* Row 8 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="usage" placeholder="Usage" className="border p-2 rounded" value={form.usage} onChange={handleChange} required />
              <input name="equip" placeholder="Équipe" className="border p-2 rounded" value={form.equip} onChange={handleChange} required />
              <input name="utilisateu" placeholder="Utilisateur" className="border p-2 rounded" value={form.utilisateu} onChange={handleChange} required />
            </div>

            {/* Row 9 */}
            <div className="grid grid-cols-3 gap-4">
              <input name="typ_captag" placeholder="Type Captage" className="border p-2 rounded" value={form.typ_captag} onChange={handleChange} required />
              <input name="crepi" placeholder="Crepi" className="border p-2 rounded" value={form.crepi} onChange={handleChange} required />
              <input name="code___nom" placeholder="Code Nom" className="border p-2 rounded" value={form.code___nom} onChange={handleChange} required />
            </div>

            {/* Submit Button */}
            <div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={()=> navigate('/forages')}>
                Ajouter
              </button>

            </div>
          </form>


        </div>
        </div>
      
    
  )

}


export default AddForages;