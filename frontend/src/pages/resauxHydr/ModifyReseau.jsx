import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import "react-datepicker/dist/react-datepicker.css";

function ModifyReseau() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedReseau = location.state?.reseau;

  const [form, setForm] = useState({
    geom: '',
    longeur: '',
    hylide: '',
    hyltyp: '',
    hylnom: ''
  });
  
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (selectedReseau) {
      console.log("Received selectedReseau:", selectedReseau); 
      setEditId(selectedReseau.id)
      setForm({
        geom: selectedReseau.geom || '',
        longeur: selectedReseau.longeur || '',
        hylide: selectedReseau.hylide || '',
        hyltyp: selectedReseau.hyltyp || '',
        hylnom: selectedReseau.hylnom || '',
      });
    } else {
      console.warn("No Hydrographic Network was passed in location.state");
    }
  }, [selectedReseau]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) {
      console.error('No edit ID found. Cannot update Hydrographic Network.');
      alert("Unable to save: Hydrographic Network ID missing.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/reseauHydr/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        alert('Hydrographic Network updated successfully!');
        navigate('/admin/reseau');
      } else {
        throw new Error('Failed to update hydrographic network');
      }
    } catch (error) {
      console.error('Error updating Hydrographic Network:', error);
      alert('Error updating hydrographic network. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-8 px-6 bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-start mb-6">
          <BackButton destination='/admin/reseauX' />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Hydrographic Network</h2>

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

            {/* Two column fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Length</label>
                <input 
                  name="longeur" 
                  placeholder="Length" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.longeur} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Hydrographic ID</label>
                <input 
                  name="hylide" 
                  placeholder="Hydrographic ID" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.hylide} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Another two column fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Hydrographic Type</label>
                <input 
                  name="hyltyp" 
                  placeholder="Hydrographic type" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.hyltyp} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Hydrographic Name</label>
                <input 
                  name="hylnom" 
                  placeholder="Hydrographic name" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  value={form.hylnom} 
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

export default ModifyReseau;