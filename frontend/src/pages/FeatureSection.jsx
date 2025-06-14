import React from 'react'
import { FaMicrochip, FaWater, FaBell } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'



const FeatureSection = () => {
  const navigate = useNavigate()
  return (
    <section  className="w-full h-screen flex flex-col justify-start items-center bg-blue-800 py-16 px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-12">
        Fonctionnalités clés
      </h2>
      <div className="flex flex-wrap justify-center gap-10">
        <div className="bg-white p-6 rounded-2xl shadow-md w-72 hover:scale-105 transition">
          <FaMicrochip className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 onClick={() => navigate('/VisulisationSensor')} className="text-xl font-semibold mb-2 text-blue-700">
            Visualisation de données IoT
          </h3>
          <p className="text-gray-600">
            Accédez aux données capteurs en temps réel via des graphiques interactifs.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md w-72 hover:scale-105 transition">
          <FaWater className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 onClick={() => navigate('/nappes')} className="text-xl font-semibold mb-2 text-blue-700">
            Suivi des Nappes 
          </h3>
          <p className="text-gray-600">
            Analysez l'évolution du niveau et de la qualité de l’eau en continu.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md w-72 hover:scale-105 transition">
          <FaBell className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-blue-700">
            Alertes intelligentes
          </h3>
          <p className="text-gray-600">
            Soyez averti automatiquement en cas de dépassement de seuil ou d’anomalie.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection