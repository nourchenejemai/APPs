import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import BizerteMap from './BizerteMap.jsx';

const ContenuHome = () => {
  const { userData } = useContext(AppContext);

  return (
     <div className="w-full flex flex-col items-center justify-start text-center text-blue-900">
  {/* Map Section */}
  <section className="w-full h-screen flex flex-col justify-start items-center">
    <div className="w-full h-full">
      <BizerteMap />
    </div>
  </section>
</div>

  );
};

export default ContenuHome;