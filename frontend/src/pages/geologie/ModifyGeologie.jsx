import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyGeologie() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedGeolog = location.state?.geolog || {};

    const [form, setForm] = useState({
        geom: '',
        superficie: '',
        age: '',
        lithologie: '',
        code: '',
        descript: ''
    });
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (selectedGeolog) {
            console.log("Received selectedGeology:", selectedGeolog); 
            setEditId(selectedGeolog.id)
            setForm({
                geom: selectedGeolog.geom || '',
                superficie: selectedGeolog.superficie || '',
                age: selectedGeolog.age || '',
                lithologie: selectedGeolog.lithologie || '',
                code: selectedGeolog.code || '',
                descript: selectedGeolog.descript || '',
            });
        } else {
            console.warn("No Geology was passed in location.state");
        }
    }, [selectedGeolog]);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId) {
            console.error('No edit ID found. Cannot update Geology.');
            alert("Unable to save: Geology ID missing.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/geologie/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Geology updated successfully!');
                navigate('/admin/geologie');
            } else {
                throw new Error('Failed to update geology');
            }
        } catch (error) {
            console.error('Error updating Geology:', error);
            alert('Error updating geology. Please try again.');
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
                    <BackButton destination='/admin/geologie' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Geology</h2>

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

                        {/* Three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Superficie</label>
                                <input 
                                    name="superficie" 
                                    placeholder="Superficie" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.superficie} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <input 
                                    name="age" 
                                    placeholder="Age" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.age} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Lithologie</label>
                                <input 
                                    name="lithologie" 
                                    placeholder="Lithologie" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.lithologie} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Two column fields for the remaining inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input 
                                    name="descript" 
                                    placeholder="Description" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.descript} 
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

export default ModifyGeologie;