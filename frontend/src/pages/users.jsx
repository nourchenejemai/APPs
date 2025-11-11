import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NavbarAdmin from '../components/NavbarAdmin';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/user/getusers');
      
      if (!response.ok) {
        throw new Error(`Le serveur a retourné ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Échec de la récupération des utilisateurs:', err);
      setError('Échec du chargement des utilisateurs. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/delete/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Échec de la suppression: ${response.status}`);
      }
      
      setSuccess('Utilisateur supprimé avec succès');
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Échec de la suppression de l\'utilisateur');
    }
  };

  const toggleDataAccess = async (userId, currentAccess) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasDataAccess: !currentAccess }),
      });
      
      if (!response.ok) {
        throw new Error(`Échec de la mise à jour: ${response.status}`);
      }
      
      setSuccess('Accès aux données mis à jour avec succès');
      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user._id === userId ? { ...user, hasDataAccess: !currentAccess } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user._id === userId ? { ...user, hasDataAccess: !currentAccess } : user
      ));
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Échec de la mise à jour de l\'accès aux données');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (hasDataAccess) => {
    return hasDataAccess 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
   
        
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">👥 Gestion des Utilisateurs</h1>
            
            <div className="flex gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{filteredUsers.length}</span> utilisateurs sur <span className="font-medium">{users.length}</span>
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Rôle
                        </th>
                        
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                              <p className="mt-1">Essayez d'ajuster votre recherche pour trouver ce que vous cherchez.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-blue-800">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name || 'Inconnu'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                {user.role || 'utilisateur'}
                              </span>
                            </td>
                           
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                
                                <button
                                  onClick={() => deleteUser(user._id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
     
  );
}

export default Users;