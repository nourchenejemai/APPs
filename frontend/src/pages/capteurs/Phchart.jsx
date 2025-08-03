import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';

const Phchart = () => {
  const [ph, setPh] = useState(7); // default pH

  useEffect(() => {
    const fetchPh = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/getph");
        const result = await res.json();

        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          const lastValue = result.data[result.data.length - 1].ph;
          setPh(lastValue);
        }
      } catch (error) {
        console.error("Erreur de récupération des données de pH", error);
      }
    };

    fetchPh();
    const interval = setInterval(fetchPh, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Normalize pH (0-14) to percent (0 to 1)
  const percent = ph / 14;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
  <div className="p-4 bg-white shadow rounded-xl">
    {/* Titre centré au-dessus du graphique */}
    <div className="text-center mb-4">
      <h2 className="text-xl font-bold">Acidité de l’eau</h2>
    </div>

    {/* Conteneur du Gauge Chart avec taille contrôlée */}
    <div className="flex items-center justify-center h-[300px]">
      <GaugeChart
        id="ph-gauge"
        nrOfLevels={14}
        percent={percent}
        colors={['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#8e44ad']}
        arcWidth={0.3}
        arcsLength={Array(14).fill(1 / 14)}
        textColor="#000"
        needleColor="#000"
        formatTextValue={() => `pH ${ph.toFixed(2)}`}
      />
    </div>
  </div>
</div>





    
  );
};

export default Phchart;

