import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function Addpedologie() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/Addpedologie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Pedology data added successfully!');
                setForm({
                    id: '',
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
                navigate('/pedologie');
            } else {
                throw new Error('Failed to add pedology data');
            }
        } catch (error) {
            console.error('Error adding pedology data:', error);
            alert('Error adding pedology data. Please try again.');
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
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Pedology Data</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Geometry Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Geometry</label>
                            <input 
                                name="geom" 
                                placeholder="Enter geometry data" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.geom} 
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        {/* Row 1 - Code, Surface, Perimeter */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Code</label>
                                <input 
                                    name="code" 
                                    placeholder="Soil code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.code} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Surface Area</label>
                                <input 
                                    name="surface" 
                                    placeholder="Surface area" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.surface} 
                                    onChange={handleChange} 
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 - Color, Parent Rock, Texture */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input 
                                    name="couleur" 
                                    placeholder="Soil color" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.couleur} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Parent Rock</label>
                                <input 
                                    name="rocheme" 
                                    placeholder="Parent rock material" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.rocheme} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Texture</label>
                                <input 
                                    name="texture" 
                                    placeholder="Soil texture" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.texture} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3 - Salinity, Water Activity, Calcium Charge */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salinity</label>
                                <input 
                                    name="salure" 
                                    placeholder="Soil salinity" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.salure} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Activity</label>
                                <input 
                                    name="acteau" 
                                    placeholder="Water activity level" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.acteau} 
                                    onChange={handleChange} 
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Depth Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Depth</label>
                            <input 
                                name="profond" 
                                placeholder="Soil depth" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.profond} 
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Pedology Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addpedologie;