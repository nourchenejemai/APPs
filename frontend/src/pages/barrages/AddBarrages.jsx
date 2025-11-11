import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';

function AddBarrage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        name_ar: '',
        name_fr: '',
        type_bge: '',
        gouver: '',
        code: '',
        disc: '',
        geom: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/barrages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Dam added successfully!');
                navigate('/admin/barrage');
            } else {
                throw new Error('Failed to add dam');
            }
        } catch (error) {
            console.error('Error adding dam:', error);
            alert('Error adding dam. Please try again.');
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
                    <BackButton destination='/admin/barrage' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Barrage</h2>

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

                        {/* Three column fields - Names */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input 
                                    name="name" 
                                    placeholder="Name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.name} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Arabic Name</label>
                                <input 
                                    name="name_ar" 
                                    placeholder="Arabic name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.name_ar} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">French Name</label>
                                <input 
                                    name="name_fr" 
                                    placeholder="French name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.name_fr} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Another three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Dam Type</label>
                                <input 
                                    name="type_bge" 
                                    placeholder="Dam type" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.type_bge} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Governorate</label>
                                <input 
                                    name="gouver" 
                                    placeholder="Governorate" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.gouver} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
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
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea 
                                name="disc" 
                                placeholder="Enter description" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none" 
                                rows="4"
                                value={form.disc} 
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
                                {loading ? 'Adding...' : 'Add Dam'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddBarrage;