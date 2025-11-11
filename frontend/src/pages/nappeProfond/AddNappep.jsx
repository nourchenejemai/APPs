import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';

function AddNappep() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        geom: '',
        surface: '',
        perimetre: '',
        npride: '',
        nprnom: '',
        nprcod: '',
        nprres: '',
        nprexp: '',
        nprqmi: '',
        nprqma: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/nappesp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Deep water table added successfully!');
                navigate('/admin/nappesp');
            } else {
                throw new Error('Failed to add deep water table');
            }
        } catch (error) {
            console.error('Error adding deep water table:', error);
            alert('Error adding deep water table. Please try again.');
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
                    <BackButton destination='/admin/nappepro' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Deep Water Table</h2>

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

                        {/* Three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Surface</label>
                                <input 
                                    name="surface" 
                                    placeholder="Surface" 
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
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table ID</label>
                                <input 
                                    name="npride" 
                                    placeholder="Water table ID" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.npride} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Another three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Name</label>
                                <input 
                                    name="nprnom" 
                                    placeholder="Water table name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprnom} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Code</label>
                                <input 
                                    name="nprcod" 
                                    placeholder="Water table code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprcod} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Resource</label>
                                <input 
                                    name="nprres" 
                                    placeholder="Water table resource" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprres} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Final three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Exploitation</label>
                                <input 
                                    name="nprexp" 
                                    placeholder="Exploitation" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprexp} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Minimum Flow Rate</label>
                                <input 
                                    name="nprqmi" 
                                    placeholder="Minimum flow rate" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprqmi} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Maximum Flow Rate</label>
                                <input 
                                    name="nprqma" 
                                    placeholder="Maximum flow rate" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nprqma} 
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
                                {loading ? 'Adding...' : 'Add Deep Water Table'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNappep;