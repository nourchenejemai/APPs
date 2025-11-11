import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyNappeph() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedNappe = location.state?.nappe;

    const [form, setForm] = useState({
        geom: '',
        surface: '',
        perimetre: '',
        nphide: '',
        nphnom: '',
        nphcod: '',
        nphres: '',
        nphexp: '',
        nphqmi: '',
        nphqma: ''
    });
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (selectedNappe) {
            console.log("Received selectedNappe:", selectedNappe); 
            setEditId(selectedNappe.id)
            setForm({
                geom: selectedNappe.geom || '',
                surface: selectedNappe.surface || '',
                perimetre: selectedNappe.perimetre || '',
                nphide: selectedNappe.nphide || '',
                nphnom: selectedNappe.nphnom || '',
                nphcod: selectedNappe.nphcod || '',
                nphres: selectedNappe.nphres || '',
                nphexp: selectedNappe.nphexp || '',
                nphqmi: selectedNappe.nphqmi || '',
                nphqma: selectedNappe.nphqma || '',
            });
        } else {
            console.warn("No nappe Phreatique was passed in location.state");
        }
    }, [selectedNappe]);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId) {
            console.error('No edit ID found. Cannot update water table');
            alert("Unable to save: Water table ID missing.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/nappes/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Water table updated successfully!');
                navigate('/admin/nappes');
            } else {
                throw new Error('Failed to update water table');
            }
        } catch (error) {
            console.error('Error updating Water table:', error);
            alert('Error updating water table. Please try again.');
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
                    <BackButton destination='/admin/nappes' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Phreatic Water Table</h2>

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
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table ID</label>
                                <input 
                                    name="nphide" 
                                    placeholder="Water table ID" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphide} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Second row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Name</label>
                                <input 
                                    name="nphnom" 
                                    placeholder="Water table name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphnom} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Code</label>
                                <input 
                                    name="nphcod" 
                                    placeholder="Water table code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphcod} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Water Table Resource</label>
                                <input 
                                    name="nphres" 
                                    placeholder="Water table resource" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphres} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Third row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Exploitation</label>
                                <input 
                                    name="nphexp" 
                                    placeholder="Exploitation" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphexp} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Minimum Flow Rate</label>
                                <input 
                                    name="nphqmi" 
                                    placeholder="Minimum flow rate" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphqmi} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Maximum Flow Rate</label>
                                <input 
                                    name="nphqma" 
                                    placeholder="Maximum flow rate" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nphqma} 
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

export default ModifyNappeph;