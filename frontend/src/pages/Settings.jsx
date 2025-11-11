import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft,Save } from "lucide-react";

// Settings Page Component
export function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: "english",
    timezone: "GMT+1",
    theme: "light"
  });

  const handleSettingChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically send updated settings to the backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
    
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
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <button
                onClick={handleSaveSettings}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save size={18} className="mr-2" />
                Save Settings
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Application Settings</h2>
                
                <div className="space-y-8">
                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-800">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-800">Push Notifications</p>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange("language", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="english">English</option>
                          <option value="french">French</option>
                          <option value="arabic">Arabic</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Timezone</label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleSettingChange("timezone", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="GMT+1">GMT+1 (Tunisia)</option>
                          <option value="GMT+0">GMT+0 (London)</option>
                          <option value="GMT-5">GMT-5 (New York)</option>
                          <option value="GMT+8">GMT+8 (Singapore)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Theme</label>
                        <select
                          value={settings.theme}
                          onChange={(e) => handleSettingChange("theme", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (System)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
                    <div className="space-y-4">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        Change Password
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ml-4">
                        Two-Factor Authentication
                      </button>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        Deactivate Account
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-4">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
}
export default Settings