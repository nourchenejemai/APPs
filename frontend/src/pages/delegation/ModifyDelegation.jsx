import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyDelegation() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDel = location.state?.del || {};

    const [form, setForm] = useState({
        geom: '',
        object: '',
        altnamef: '',
        reftncod: '',
        codegouv: '',
        nomgouv: '',
        shapeleng: '',
        shapearea: ''
    });
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (selectedDel) {
            console.log("Received selectedDelegation:", selectedDel); 
            setEditId(selectedDel.id)
            setForm({
                geom: selectedDel.geom || '',
                object: selectedDel.object || '',
                altnamef: selectedDel.altnamef || '',
                reftncod: selectedDel.reftncod || '',
                codegouv: selectedDel.codegouv || '',
                nomgouv: selectedDel.nomgouv || '',
                shapeleng: selectedDel.shapeleng || '',
                shapearea: selectedDel.shapearea || '',
            });
        } else {
            console.warn("No Delegation was passed in location.state");
        }
    }, [selectedDel]);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId) {
            console.error('No edit ID found. Cannot update Delegation.');
            alert("Impossible d'enregistrer : ID du Delegation manquant.");
            return;
        }
        setLoading(true);

        try {
            await fetch(`http://localhost:8080/api/delegation/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            alert('Delegation updated successfully!');
            navigate('/delegation');
        } catch (error) {
            console.error('Error updating Delegation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-8 px-6 bg-gradient-to-b from-blue-100 to-blue-300">
            <div className="max-w-4xl mx-auto"> {/* Reduced max width for better form proportions */}
                <div className="flex justify-start mb-6">
                    <BackButton destination='/admin/delegation' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8"> {/* Added more padding and shadow */}
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Delegation</h2>

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
                                <label className="block text-sm font-medium text-gray-700">Object</label>
                                <input 
                                    name="object" 
                                    placeholder="Object" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.object} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Alt Name</label>
                                <input 
                                    name="altnamef" 
                                    placeholder="Alt name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.altnamef} 
                                    onChange={handleChange} 
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
                                />
                            </div>
                        </div>

                        {/* Another three column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Government Code</label>
                                <input 
                                    name="codegouv" 
                                    placeholder="Government code" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.codegouv} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Government Name</label>
                                <input 
                                    name="nomgouv" 
                                    placeholder="Government name" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.nomgouv} 
                                    onChange={handleChange} 
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
                                />
                            </div>
                        </div>

                        {/* Shape Area - Full width */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Shape Area</label>
                            <input 
                                name="shapearea" 
                                placeholder="Enter shape area" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.shapearea} 
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

export default ModifyDelegation;