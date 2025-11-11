import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function Addvertisol() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
        geom: '',
        couleur: '',
        typecoul: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/Addvertisol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Vertisol data added successfully!');
                setForm({
                    id: '',
                    geom: '',
                    couleur: '',
                    typecoul: ''
                });
                navigate('/admin/vertisol');
            } else {
                throw new Error('Failed to add vertisol data');
            }
        } catch (error) {
            console.error('Error adding vertisol data:', error);
            alert('Error adding vertisol data. Please try again.');
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
                    <BackButton destination='/admin/vertisol' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Vertisol Data</h2>

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

                        {/* Color Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Color</label>
                            <input 
                                name="couleur" 
                                placeholder="Enter vertisol color" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.couleur} 
                                onChange={handleChange} 
                                required
                            />
                        </div>

                        {/* Vertisol Type Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Vertisol Type</label>
                            <input 
                                name="typecoul" 
                                placeholder="Enter vertisol type" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.typecoul} 
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
                                {loading ? 'Adding...' : 'Add Vertisol Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addvertisol;