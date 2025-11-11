import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  // Menu items with icons and paths
  const menuItems = [
    { path: "/admin/Main", icon: "📊", label: "Dashboard" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/forages", icon: "🧪", label: "Forages" },
    { path: "/admin/barrage", icon: "🏞️", label: "Barrages" },
    { path: "/admin/nappes", icon: "💧", label: "Nappe Phreatique" },
    { path: "/admin/nappepro", icon: "💧⬇️", label: "Nappe Profonde" },
    { path: "/admin/climat", icon: "☀️", label: "Climat" },
    { path: "/admin/delegation", icon: "🗺️", label: "Delegation" },
    { path: "/admin/geologie", icon: "⛰️", label: "Geologie" },
    { path: "/admin/cnbz", icon: "📈", label: "CnBZ" },
    { path: "/admin/pedologie", icon: "🌱", label: "Pedologie" },
    { path: "/admin/vertisol", icon: "🧱", label: "Vertisol" },
      { path: "/admin/reseaux", icon: "🌐", label: "Reseaux Hydrographiques" },
      

  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white min-h-screen shadow-xl p-4 flex flex-col sticky top-0">
      {/* Sidebar header */}
      <div className="p-4 mb-6 border-b border-blue-700">
     
        <p className="text-blue-200 text-xs mt-1">Admin Panel</p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-blue-700 text-blue-100'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-blue-200 rounded-full"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      <div className="pt-4 mt-auto border-t border-blue-700">
        <div className="flex items-center p-3 text-blue-200 text-sm">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span>👤</span>
            </div>
          </div>
          <div className="truncate">
            <p className="font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 