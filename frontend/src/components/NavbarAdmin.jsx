import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, User, X, ChevronDown, Settings, LogOut, Home } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext'; // Ajustez le chemin selon votre structure

const Navbar = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const notificationsRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Récupération des données utilisateur depuis le contexte
  const { userData, isLoggedin, backendUrl } = useContext(AppContext);

  // Fonction pour récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/getnotification`);
      console.log('Notifications API response:', response.data);
      if (response.data.success) {
        setNotifications(response.data.notifications);
        const unreadCount = response.data.notifications.filter(notification => !notification.read).length;
        setUnreadNotifications(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${backendUrl}/api/${notificationId}/read`);
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
      setUnreadNotifications(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await axios.put(`${backendUrl}/api/mark-all-read`);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadNotifications(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Fonction pour supprimer une notification
  const removeNotification = async (notificationId) => {
    try {
      await axios.delete(`${backendUrl}/api/${notificationId}`);
      const notificationToRemove = notifications.find(n => n._id === notificationId);
      if (notificationToRemove && !notificationToRemove.read) {
        setUnreadNotifications(prev => prev - 1);
      }
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  // Fonction pour simuler un nouvel utilisateur (pour les tests)
  const simulateNewUser = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/simulate-new-user`, {
        name: 'New User',
        email: `user${Date.now()}@example.com`
      });
      
      if (response.data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error simulating new user:', error);
    }
  };

  // Formatage du temps
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return notificationTime.toLocaleDateString('fr-FR');
  };

  // Gestion des clics en dehors des dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charger les notifications au montage du composant
  useEffect(() => {
    if (isLoggedin) {
      fetchNotifications();
      
      // Polling pour les nouvelles notifications (toutes les 30 secondes)
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedin]);

  // Fonctions de navigation
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/admin/profile');
    setOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/admin/settings');
    setOpen(false);
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Récupérer les données utilisateur depuis le contexte
  const userName = userData?.name || userData?.username || 'Name';
  const userEmail = userData?.email || 'Chargement...';
  const userRole = userData?.role || 'Administrator';

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 shadow-md px-6 py-3">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <div className="text-xl font-bold text-white flex items-center">
          <p className="text-white">Management System</p>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-4">
        {/* Left: Logo/Brand + Home */}
        <div className="flex items-center gap-6">
          {/* Bouton Home */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (unreadNotifications > 0 && !notificationsOpen) {
                markAllAsRead();
              }
            }}
            className="relative p-2 text-blue-100 hover:bg-blue-700 rounded-full transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                {unreadNotifications > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">Aucune notification</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification._id}
                      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors flex justify-between items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification._id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-start">
                          {notification.type === "user" && (
                            <div className="mt-1 mr-2 bg-green-100 p-1 rounded-full">
                              <User className="h-3 w-3 text-green-600" />
                            </div>
                          )}
                          {notification.type === "system" && (
                            <div className="mt-1 mr-2 bg-blue-100 p-1 rounded-full">
                              <Bell className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                          {notification.type === "alert" && (
                            <div className="mt-1 mr-2 bg-red-100 p-1 rounded-full">
                              <Bell className="h-3 w-3 text-red-600" />
                            </div>
                          )}
                          {notification.type === "sensor" && (
                            <div className="mt-1 mr-2 bg-orange-100 p-1 rounded-full">
                              <Bell className="h-3 w-3 text-orange-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt || notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification._id);
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  onClick={simulateNewUser}
                >
                  Simuler un nouvel utilisateur (Test)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none group"
          >
            <div className="relative">
              <img
                src={assets.myphoto}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-blue-300 group-hover:border-blue-200 transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-medium text-white block">{userName}</span>
              <span className="text-xs text-blue-200 block">{userRole}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-blue-200 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">Connecté en tant que</p>
                <p className="text-sm text-gray-600 truncate">{userEmail}</p>
              </div>
              <button 
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Profil
              </button>
              <button 
                onClick={handleSettingsClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2 text-gray-500" />
                Paramètres
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;