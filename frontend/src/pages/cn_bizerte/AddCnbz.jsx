import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function AddCnbz() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/Addcn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(form),
            });
            
            if (response.ok) {
                alert('Contour line added successfully!');
                setForm({
                    id: '',
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
                navigate('/cnbz');
            } else {
                throw new Error('Failed to add contour line');
            }
        } catch (error) {
            console.error('Error adding contour line:', error);
            alert('Error adding contour line. Please try again.');
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
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Contour Line</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1 - Geometry and Object */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        {/* Row 2 - From Node and To Node */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">From Node</label>
                                <input 
                                    name="fnode" 
                                    placeholder="From node" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.fnode} 
                                    onChange={handleChange} 
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3 - Left Polygon and Right Polygon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Left Polygon</label>
                                <input 
                                    name="lpoly" 
                                    placeholder="Left polygon" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.lpoly} 
                                    onChange={handleChange} 
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 4 - Length and CNV1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Length</label>
                                <input 
                                    name="lengthh" 
                                    placeholder="Length" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.lengthh} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CNV1</label>
                                <input 
                                    name="cnv1" 
                                    placeholder="CNV1 value" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnv1} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 5 - CNV1 ID and Alternative CN Value */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CNV1 ID</label>
                                <input 
                                    name="cnv1id" 
                                    placeholder="CNV1 ID" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnv1id} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Alternative CN Value</label>
                                <input 
                                    name="cnvalt" 
                                    placeholder="Alternative CN value" 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                    value={form.cnvalt} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 6 - Shape Length (Full Width) */}
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

                        {/* Submit Button */}
                        <div className="text-center pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Contour Line'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCnbz;