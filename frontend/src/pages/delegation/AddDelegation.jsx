import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddDelegation() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
        geom: '',
        object: '',
        altnamef: '',
        reftncod: '',
        codegouv: '',
        nomgouv: '',
        shapeleng: '',
        shapearea: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/Adddelegation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Delegation added successfully!');
                setForm({
                    id: '',
                    geom: '',
                    object: '',
                    altnamef: '',
                    reftncod: '',
                    codegouv: '',
                    nomgouv: '',
                    shapeleng: '',
                    shapearea: ''
                });
                navigate('/delegation');
            } else {
                throw new Error('Failed to add delegation');
            }
        } catch (error) {
            console.error('Error adding delegation:', error);
            alert('Error adding delegation. Please try again.');
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
                    <BackButton destination='/admin/delegation' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Delegation</h2>

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

                        {/* Three column fields - Object, Alternative Name, Reference Code */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Object</label>
                                <input 
                                    name="object" 
                                    placeholder="Object" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.object} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Alternative Name</label>
                                <input 
                                    name="altnamef" 
                                    placeholder="Alternative name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.altnamef} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Reference Code</label>
                                <input 
                                    name="reftncod" 
                                    placeholder="Reference code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.reftncod} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Another three column fields - Governorate Code, Governorate Name, Shape Length */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Governorate Code</label>
                                <input 
                                    name="codegouv" 
                                    placeholder="Governorate code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.codegouv} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Governorate Name</label>
                                <input 
                                    name="nomgouv" 
                                    placeholder="Governorate name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nomgouv} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Shape Length</label>
                                <input 
                                    name="shapeleng" 
                                    placeholder="Shape length" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.shapeleng} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Shape Area Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Shape Area</label>
                            <input 
                                name="shapearea" 
                                placeholder="Shape area" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.shapearea} 
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
                                {loading ? 'Adding...' : 'Add Delegation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddDelegation;