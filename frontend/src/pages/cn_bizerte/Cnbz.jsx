import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, AlertCircle, Upload, Download } from 'lucide-react';
import '../../App.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/Sidebar';
import NavbarAdmin from '../../components/NavbarAdmin';

function Cnbz() {
  const [cnbz, setCnbz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const limit = 50;
  const navigate = useNavigate();

  const fetchCn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = searchTerm 
        ? `http://localhost:8080/api/cn/${searchTerm}`
        : `http://localhost:8080/api/cn?page=${page}&limit=${limit}`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (searchTerm) {
        // Handle single result from ID search
        if (data.message === "Contour line not found") {
          setCnbz([]);
        } else {
          setCnbz([data]);
        }
      } else {
        // Handle paginated results
        setCnbz(data.cnbz || data);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching contour lines:", error);
      setError(error.message);
      setCnbz([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, limit]);

  const handleDelete = async (id, cnbzAlt) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete contour line with altitude ${cnbzAlt || 'N/A'} (ID: ${id})?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cn/${id}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        alert("Deleted successfully!");
        fetchCn();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(`Delete failed: ${error.message}`);
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

    const confirmUpload = window.confirm(`Are you sure you want to upload "${file.name}"? This will add new contour line data.`);
    if (!confirmUpload) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadLoading(true);
      const response = await fetch('http://localhost:8080/api/cn/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`File uploaded successfully! ${result.message || 'Data has been imported.'}`);
        fetchCn(); // Refresh the data
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
      const response = await fetch('http://localhost:8080/api/cn?limit=10000');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const cnbzData = data.cnbz || data;
      
      if (!cnbzData || cnbzData.length === 0) {
        alert('No data available to download');
        return;
      }

      // Create CSV content
      const headers = ['ID', 'Object', 'FNode', 'TNode', 'LPoly', 'RPoly', 'Lengthh', 'CNV1', 'CNV1ID', 'CNVAlt', 'ShapeLeng'];
      const csvHeaders = headers.join(',');
      
      const csvRows = cnbzData.map(cnbzItem => [
        cnbzItem.id || '',
        cnbzItem.object || '',
        cnbzItem.fnode || '',
        cnbzItem.tnode || '',
        cnbzItem.lpoly || '',
        cnbzItem.rpoly || '',
        cnbzItem.lengthh || '',
        cnbzItem.cnv1 || '',
        cnbzItem.cnv1id || '',
        cnbzItem.cnvalt || '',
        cnbzItem.shapeleng || ''
      ].join(','));
      
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `contour_lines_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Downloaded ${cnbzData.length} records successfully!`);
      
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
    fetchCn();
  };

  useEffect(() => {
    fetchCn();
  }, [fetchCn, page]);

  // Column configuration for better maintainability
  const columns = [
    { key: 'id', label: 'ID', width: '70px' },
    { key: 'object', label: 'Object', width: '80px' },
    { key: 'fnode', label: 'FNode', width: '80px' },
    { key: 'tnode', label: 'TNode', width: '80px' },
    { key: 'lpoly', label: 'LPoly', width: '80px' },
    { key: 'rpoly', label: 'RPoly', width: '80px' },
    { key: 'lengthh', label: 'Length', width: '90px' },
    { key: 'cnv1', label: 'CNV1', width: '80px' },
    { key: 'cnv1id', label: 'CNV1 ID', width: '90px' },
    { key: 'cnvalt', label: 'Altitude', width: '90px' },
    { key: 'shapeleng', label: 'Shape Length', width: '110px' },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <BackButton destination="/" />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Management Contour Line Bizerte</h2>
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
            disabled={downloadLoading || cnbz.length === 0}
            className={`flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 ${
              (downloadLoading || cnbz.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Download className="w-5 h-5 mr-2" />
            {downloadLoading ? 'Downloading...' : 'Download CSV'}
          </button>
          
          {/* Add Contour Line Button */}
          <button
            onClick={() => navigate('/AddCnbz')}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Contour Line
          </button>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      
      {!loading && !error && cnbz.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contour lines found
        </div>
      )}

      {/* Table */}
      {!loading && cnbz.length > 0 && (
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
                  {cnbz.map((cnbzItem) => (
                    <tr key={cnbzItem.id} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={column.key} className="p-3 text-sm text-gray-700 truncate max-w-xs">
                          {cnbzItem[column.key] || '-'}
                        </td>
                      ))}
                      <td className="p-3 flex space-x-2">
                        <button
                          onClick={() => navigate('/ModifyCnbz', { state: { cnbz: cnbzItem } })}
                          className="p-1.5 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cnbzItem.id, cnbzItem.cnvalt)}
                          className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Only show when not searching */}
          {!searchTerm && (
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setPage(page => Math.max(page - 1, 1))}
                disabled={page === 1}
                className={`flex items-center px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                className={`flex items-center px-4 py-2 rounded-md ${page >= totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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

export default Cnbz;