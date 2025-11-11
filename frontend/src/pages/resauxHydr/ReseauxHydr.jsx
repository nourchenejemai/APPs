import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, AlertCircle, Upload, Download } from 'lucide-react';
import '../../App.css';
import BackButton from '../../components/BackButton';

// Configuration constants
const API_BASE_URL = 'http://localhost:8080/api';
const ITEMS_PER_PAGE = 50;

function ReseauxHydr() {
    const [reseaux, setReseaux] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const navigate = useNavigate();

    // Column configuration for better maintainability
    const columns = [
        { key: 'id', label: 'ID', width: '80px' },
        { key: 'longeur', label: 'Longueur', width: '100px' },
        { key: 'hylide', label: 'hylIDE', width: '120px' },
        { key: 'hyltyp', label: 'hylTYPE', width: '120px' },
        { key: 'hylnom', label: 'hylnom', width: '150px' },
    ];

    const fetchReseaux = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const url = searchTerm 
                ? `${API_BASE_URL}/reseauHydr/${searchTerm}`
                : `${API_BASE_URL}/reseauHydr?page=${page}&limit=${ITEMS_PER_PAGE}`;
            
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            if (searchTerm) {
                // Handle single result from ID search
                if (data.message === "Reseau hydrographique not found") {
                    setReseaux([]);
                } else {
                    setReseaux([data]);
                }
                setTotalPages(1);
            } else {
                // Handle paginated results
                setReseaux(data.reseaux || data);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching reseaux hydrographiques:", error);
            setError(error.message);
            setReseaux([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    const handleModifyClick = (reseau) => {
        console.log("Reseau hydrographique to edit:", reseau);
        navigate('/ModifyReseau', { state: { reseau } });
    };

    const handleDelete = async (id, reseauName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${reseauName || 'this reseau hydrographique'}" (ID: ${id})?`
        );
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            const response = await fetch(`${API_BASE_URL}/reseauHydr/${id}`, { 
                method: 'DELETE' 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            alert("Deleted successfully!");
            fetchReseaux();
        } catch (error) {
            console.error("Error deleting reseau hydrographique:", error);
            alert(`Delete failed: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is CSV
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please select a CSV file');
            return;
        }

        const confirmUpload = window.confirm(`Are you sure you want to upload "${file.name}"? This will add new hydrographic network data.`);
        if (!confirmUpload) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadLoading(true);
            const response = await fetch(`${API_BASE_URL}/reseauHydr/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert(`File uploaded successfully! ${result.message || 'Data has been imported.'}`);
                fetchReseaux(); // Refresh the data
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploadLoading(false);
            // Reset the file input
            event.target.value = '';
        }
    };

    const handleDownloadCSV = async () => {
        try {
            setDownloadLoading(true);
            
            // Fetch all data for download (without pagination)
            const response = await fetch(`${API_BASE_URL}/reseauHydr?limit=10000`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const reseauxData = data.reseaux || data;
            
            if (!reseauxData || reseauxData.length === 0) {
                alert('No data available to download');
                return;
            }

            // Create CSV content
            const headers = ['ID', 'Longeur', 'HylIDE', 'HylTyp', 'HylNom'];
            const csvHeaders = headers.join(',');
            
            const csvRows = reseauxData.map(reseau => [
                reseau.id || '',
                reseau.longeur || '',
                reseau.hylide || '',
                reseau.hyltyp || '',
                reseau.hylnom || ''
            ].join(','));
            
            const csvContent = [csvHeaders, ...csvRows].join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `hydrographic_network_data_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert(`Downloaded ${reseauxData.length} records successfully!`);
            
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert(`Download failed: ${error.message}`);
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value) {
            // Reset to first page when clearing search
            setPage(1);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReseaux();
    };

    useEffect(() => {
        fetchReseaux();
    }, [fetchReseaux, page]);

    return (
        <div className="flex-1 p-6 space-y-6 overflow-auto">
            <BackButton />
            
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Management Reseaux Hydrographiques</h2>
                <div className="flex gap-2">
                    {/* Upload CSV Button */}
                    <label className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 cursor-pointer">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploadLoading}
                        />
                    </label>
                    
                    {/* Download CSV Button */}
                    <button
                        onClick={handleDownloadCSV}
                        disabled={downloadLoading || reseaux.length === 0}
                        className={`flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 ${
                            (downloadLoading || reseaux.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <Download className="w-5 h-5 mr-2" />
                        {downloadLoading ? 'Downloading...' : 'Download CSV'}
                    </button>
                    
                    {/* Add Reseau Hydrographique Button */}
                    <button
                        onClick={() => navigate('/AddReseau')}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Reseau Hydrographique
                    </button>
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="number"
                        placeholder="Search by ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Search
                </button>
            </form>

            {/* Upload Loading Indicator */}
            {uploadLoading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    Uploading CSV file...
                </div>
            )}

            {/* Download Loading Indicator */}
            {downloadLoading && (
                <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                    Preparing CSV download...
                </div>
            )}

            {/* Status Indicators */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Error: {error}
                </div>
            )}
            
            {!loading && !error && reseaux.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No reseau hydrographique found with this ID' : 'No reseaux hydrographiques data available'}
                </div>
            )}

            {/* Table */}
            {!loading && reseaux.length > 0 && (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {columns.map((column) => (
                                            <th 
                                                key={column.key} 
                                                className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                style={{ width: column.width }}
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reseaux.map((reseau) => (
                                        <tr key={reseau.id} className="hover:bg-gray-50">
                                            {columns.map((column) => (
                                                <td key={column.key} className="p-3 text-sm text-gray-700 truncate max-w-xs">
                                                    {reseau[column.key] || '-'}
                                                </td>
                                            ))}
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() => handleModifyClick(reseau)}
                                                    className="p-1.5 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reseau.id, reseau.hylnom)}
                                                    disabled={deletingId === reseau.id}
                                                    className={`p-1.5 rounded-md transition-colors ${
                                                        deletingId === reseau.id 
                                                            ? 'bg-gray-100 text-gray-400' 
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                    title={deletingId === reseau.id ? 'Deleting...' : 'Delete'}
                                                >
                                                    {deletingId === reseau.id ? (
                                                        <div className="animate-spin w-4 h-4 border-t-2 border-red-700 rounded-full" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination - Only show when not searching */}
                    {!searchTerm && totalPages > 1 && (
                        <div className="flex justify-between items-center py-4">
                            <button
                                onClick={() => setPage(page => Math.max(page - 1, 1))}
                                disabled={page === 1}
                                className={`flex items-center px-4 py-2 rounded-md ${
                                    page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </button>
                            
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            
                            <button
                                onClick={() => setPage(page => page + 1)}
                                disabled={page >= totalPages}
                                className={`flex items-center px-4 py-2 rounded-md ${
                                    page >= totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ReseauxHydr;