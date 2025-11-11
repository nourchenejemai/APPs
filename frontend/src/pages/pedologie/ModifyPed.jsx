import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyPed() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPed = location.state?.ped;

    const [form, setForm] = useState({
        geom: '',
        code: '', 
        surface: '', 
        perimetre: '', 
        couleur: '', 
        rocheme: '', 
        texture: '', 
        salure: '',
        acteau: '', 
        chargca: '', 
        profond: ''
    });
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (selectedPed) {
            console.log("Received selectedPedology:", selectedPed); 
            setEditId(selectedPed.id)
            setForm({
                geom: selectedPed.geom || '',
                code: selectedPed.code || '',
                surface: selectedPed.surface || '',
                perimetre: selectedPed.perimetre || '',
                couleur: selectedPed.couleur || '',
                rocheme: selectedPed.rocheme || '',
                texture: selectedPed.texture || '',
                salure: selectedPed.salure || '',
                acteau: selectedPed.acteau || '',
                chargca: selectedPed.chargca || '',
                profond: selectedPed.profond || '',
            });
        } else {
            console.warn("No Pedology was passed in location.state");
        }
    }, [selectedPed]);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId) {
            console.error('No edit ID found. Cannot update Pedology.');
            alert("Unable to save: Pedology ID missing.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/pedologie/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Pedology updated successfully!');
                navigate('/admin/pedologie');
            } else {
                throw new Error('Failed to update pedology');
            }
        } catch (error) {
            console.error('Error updating Pedology:', error);
            alert('Error updating pedology. Please try again.');
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
                    <BackButton destination='/admin/pedologie' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Pedology</h2>

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
                                <label className="block text-sm font-medium text-gray-700">Code</label>
                                <input 
                                    name="code" 
                                    placeholder="Code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.code} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Surface</label>
                                <input 
                                    name="surface" 
                                    placeholder="Surface" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.surface} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Perimeter</label>
                                <input 
                                    name="perimetre" 
                                    placeholder="Perimeter" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.perimetre} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Second row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input 
                                    name="couleur" 
                                    placeholder="Color" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.couleur} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Parent Rock</label>
                                <input 
                                    name="rocheme" 
                                    placeholder="Parent rock" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.rocheme} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Texture</label>
                                <input 
                                    name="texture" 
                                    placeholder="Texture" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.texture} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Third row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salinity</label>
                                <input 
                                    name="salure" 
                                    placeholder="Salinity" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.salure} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Activity</label>
                                <input 
                                    name="acteau" 
                                    placeholder="Water activity" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.acteau} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Calcium Charge</label>
                                <input 
                                    name="chargca" 
                                    placeholder="Calcium charge" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.chargca} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Depth Field - Full width */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Depth</label>
                            <input 
                                name="profond" 
                                placeholder="Depth" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.profond} 
                                onChange={handleChange} 
                            />
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

export default ModifyPed;