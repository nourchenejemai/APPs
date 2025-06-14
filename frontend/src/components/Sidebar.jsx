import { Link } from 'react-router-dom';

function Sidebar({ setSection }) {
  return (
    <div className="w-64 bg-white shadow-lg p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <Link to="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
        📊 Dashboard
      </Link>
       <Link to="/users" className="block hover:bg-gray-700 p-2 rounded">
        👥 Users
      </Link>
      <Link to="/forages" className="block hover:bg-gray-700 p-2 rounded">
        🧪 Forages
      </Link>
      <Link to="/barrage" className="block hover:bg-gray-700 p-2 rounded">
        🌊 Barrages
      </Link>
    </div>
  );
}

export default Sidebar;
