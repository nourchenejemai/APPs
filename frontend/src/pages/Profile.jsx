import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';

// Profile Page Component
export function Profile() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+216 12 345 678",
    address: "Tunis, Tunisia",
    role: "Administrator",
    department: "Water Management",
    bio: "System administrator with full access to manage users, barrages, and system settings."
  });

  // Mettre à jour profileData quand userData change
  useEffect(() => {
    if (userData) {
      setProfileData(prev => ({
        ...prev,
        name: userData.name || userData.username || "Nourchene",
        email: userData.email || "nourchene@example.com",
        role: userData.role || "Administrator",
        department: userData.department || "Water Management",
        bio: userData.bio || "System administrator with full access to manage users, barrages, and system settings."
      }));
    }
  }, [userData]);

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous enverriez normalement les données mises à jour au backend
    console.log("Données sauvegardées:", profileData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valeurs par défaut en attendant le chargement
  const displayName = profileData.name || userData?.name || userData?.username || "Nourchene";
  const displayEmail = profileData.email || userData?.email || "nourchene@example.com";
  const displayRole = profileData.role || userData?.role || "Administrator";

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <div className="ml-auto">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 h-32 relative">
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-800 text-4xl font-bold">
                  {displayName.charAt(0)}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                    <Camera size={16} className="text-blue-600" />
                    <input type="file" className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <User size={18} className="mr-2 text-gray-500" />
                    {displayName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail size={18} className="mr-2 text-gray-500" />
                    {displayEmail}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Phone size={18} className="mr-2 text-gray-500" />
                    {profileData.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin size={18} className="mr-2 text-gray-500" />
                    {profileData.address}
                  </div>
                )}
              </div>

              {/* Professional Information */}
              <div className="col-span-2 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="text-gray-900">{displayRole}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <div className="text-gray-900">{profileData.department}</div>
              </div>

              {/* Bio */}
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;