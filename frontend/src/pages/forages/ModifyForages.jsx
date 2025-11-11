import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyForages() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const selectedForage = location.state?.forage || null;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    geom: '', abréviati: '', nom: '', nirh: '', x: '', y: '', z: '', numéro_de: '', titre_de_l: '',
    délégati: '', date_d: '', date_fin: '', profondeur: '', débit: '', rabatement: '',
    ns: '', ph: '', salinité_: '', rs: '', entreprise: '', proge: '', nature: '',
    usage: '', equip: '', utilisateu: '', typ_captag: '', crepi: '', code___nom: ''
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedForage) {
      console.log("Received selectedDrilling:", selectedForage); 
      setEditId(selectedForage.gid);
      setForm({
        geom: selectedForage.geom || '',
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
    } else {
      console.warn("No drilling was passed in location.state");
    }
  }, [selectedForage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) {
      console.error('No edit ID found. Cannot update drilling.');
      alert("Unable to save: Drilling ID missing.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/forages/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        alert('Drilling updated successfully!');
        navigate('/admin/forages');
      } else {
        throw new Error('Failed to update drilling');
      }
    } catch (error) {
      console.error('Error updating drilling:', error);
      alert('Error updating drilling. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-8 px-6 bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-start mb-6">
          <BackButton destination='/admin/forages' />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Drilling</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Geometry Field - Full width */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Geometry</label>
              <input 
                name="geom" 
                placeholder="Enter geometry data" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                value={form.geom} 
                onChange={handleChange} 
              />
            </div>

            {/* First row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Abbreviation</label>
                <input 
                  name="abréviati" 
                  placeholder="Abbreviation" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.abréviati} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  name="nom" 
                  placeholder="Name" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.nom} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">NIRH</label>
                <input 
                  name="nirh" 
                  placeholder="NIRH" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.nirh} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Second row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">X Coordinate</label>
                <input 
                  name="x" 
                  placeholder="X coordinate" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.x} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Y Coordinate</label>
                <input 
                  name="y" 
                  placeholder="Y coordinate" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.y} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Z Coordinate</label>
                <input 
                  name="z" 
                  placeholder="Z coordinate" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.z} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Third row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number</label>
                <input 
                  name="numéro_de" 
                  placeholder="Number" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.numéro_de} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  name="titre_de_l" 
                  placeholder="Title" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.titre_de_l} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Delegation</label>
                <input 
                  name="délégati" 
                  placeholder="Delegation" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.délégati} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Fourth row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  name="date_d" 
                  placeholder="Start date" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.date_d} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  name="date_fin" 
                  placeholder="End date" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.date_fin} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Depth</label>
                <input 
                  name="profondeur" 
                  placeholder="Depth" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.profondeur} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Fifth row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Flow Rate</label>
                <input 
                  name="débit" 
                  placeholder="Flow rate" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.débit} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Drawdown</label>
                <input 
                  name="rabatement" 
                  placeholder="Drawdown" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.rabatement} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">NS</label>
                <input 
                  name="ns" 
                  placeholder="NS" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.ns} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Sixth row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">pH</label>
                <input 
                  name="ph" 
                  placeholder="pH" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.ph} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Salinity</label>
                <input 
                  name="salinité_" 
                  placeholder="Salinity" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.salinité_} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">RS</label>
                <input 
                  name="rs" 
                  placeholder="RS" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.rs} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Seventh row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input 
                  name="entreprise" 
                  placeholder="Company" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.entreprise} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Program</label>
                <input 
                  name="proge" 
                  placeholder="Program" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.proge} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nature</label>
                <input 
                  name="nature" 
                  placeholder="Nature" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.nature} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Eighth row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Usage</label>
                <input 
                  name="usage" 
                  placeholder="Usage" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.usage} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Equipment</label>
                <input 
                  name="equip" 
                  placeholder="Equipment" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.equip} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">User</label>
                <input 
                  name="utilisateu" 
                  placeholder="User" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.utilisateu} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Ninth row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Capture Type</label>
                <input 
                  name="typ_captag" 
                  placeholder="Capture type" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.typ_captag} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lining</label>
                <input 
                  name="crepi" 
                  placeholder="Lining" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.crepi} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Code Name</label>
                <input 
                  name="code___nom" 
                  placeholder="Code name" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.code___nom} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModifyForages;