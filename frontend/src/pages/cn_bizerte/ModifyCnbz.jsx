import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import "react-datepicker/dist/react-datepicker.css";

function ModifyCnbz() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCnbz = location.state?.cnbz || {};

    const [form, setForm] = useState({
        geom: '',
        object: '',
        fnode: '',
        tnode: '',
        lpoly: '',
        rpoly: '',
        lengthh: '',
        cnv1: '',
        cnv1id: '',
        cnvalt: '',
        shapeleng: ''
    });
    
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (selectedCnbz) {
            console.log("Received selectedCnbz:", selectedCnbz); 
            setEditId(selectedCnbz.id)
            setForm({
                geom: selectedCnbz.geom || '',
                object: selectedCnbz.object || '',
                fnode: selectedCnbz.fnode || '',
                tnode: selectedCnbz.tnode || '',
                lpoly: selectedCnbz.lpoly || '',
                rpoly: selectedCnbz.rpoly || '',
                lengthh: selectedCnbz.lengthh || '',
                cnv1: selectedCnbz.cnv1 || '',
                cnv1id: selectedCnbz.cnv1id || '',
                cnvalt: selectedCnbz.cnvalt || '',
                shapeleng: selectedCnbz.shapeleng || '',
            });
        } else {
            console.warn("No Contour line was passed in location.state");
        }
    }, [selectedCnbz]);
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId) {
            console.error('No edit ID found. Cannot update Contour line.');
            alert("Unable to save: Contour line ID missing.");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/cn/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Contour line updated successfully!');
                navigate('/admin/cnbz');
            } else {
                throw new Error('Failed to update contour line');
            }
        } catch (error) {
            console.error('Error updating Contour line:', error);
            alert('Error updating contour line. Please try again.');
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
                    <BackButton destination='/admin/cnbz' />
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Modify Courbe niveau</h2>

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
                                <label className="block text-sm font-medium text-gray-700">From Node</label>
                                <input 
                                    name="fnode" 
                                    placeholder="From node" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.fnode} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">To Node</label>
                                <input 
                                    name="tnode" 
                                    placeholder="To node" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.tnode} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Second row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Left Polygon</label>
                                <input 
                                    name="lpoly" 
                                    placeholder="Left polygon" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.lpoly} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Right Polygon</label>
                                <input 
                                    name="rpoly" 
                                    placeholder="Right polygon" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.rpoly} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Length</label>
                                <input 
                                    name="lengthh" 
                                    placeholder="Length" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.lengthh} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Third row - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CNV1</label>
                                <input 
                                    name="cnv1" 
                                    placeholder="CNV1" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnv1} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CNV1 ID</label>
                                <input 
                                    name="cnv1id" 
                                    placeholder="CNV1 ID" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnv1id} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CNV Altitude</label>
                                <input 
                                    name="cnvalt" 
                                    placeholder="CNV altitude" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnvalt} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Shape Length - Full width */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Shape Length</label>
                            <input 
                                name="shapeleng" 
                                placeholder="Enter shape length" 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                value={form.shapeleng} 
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

export default ModifyCnbz;