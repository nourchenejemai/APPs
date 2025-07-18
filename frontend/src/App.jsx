import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../src/pages/Home'
import Login from '../src/pages/Login.jsx'
import EmailVerify from '../src/pages/EmailVerify.jsx'
import ResetPassword from '../src/pages/ResetPassword.jsx'

import { ToastContainer } from 'react-toastify';
import { AppContextProvider }from '../src/context/AppContext.jsx'
import Navbar from './components/home/Navbar.jsx'

import VisualisationSensor from './pages/VisualisationSensor.jsx'
import Contact from './pages/Contact.jsx'
import DataDisplay from './pages/DataDisplay.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import Barrages from './pages/barrages/Barrages.jsx'
import BizerteMap from './pages/BizerteMap.jsx'
import BarragesMap from './pages/barrages/EmplacBarrages.jsx'
import Forages from './pages/forages/Forages.jsx'
import ForagesMap from './pages/forages/EmplacForages.jsx'
import AddForages from './pages/forages/AddForages.jsx'
import ModifyForages from './pages/forages/ModifyForages.jsx'
import AddBarrages from './pages/barrages/AddBarrages.jsx'
import ModifyBarrage from './pages/barrages/ModifyBarrage.jsx'

import Nappe_Ph from './pages/nappePhreatique/Nappe_Ph.jsx'
import ModifyNappeph from './pages/nappePhreatique/ModifyNappeph.jsx'
import NappePhMap from './pages/nappePhreatique/EmplacNappaph.jsx'


import Nappepro from './pages/nappeProfond/Nappepro.jsx'
import ModifyNappep from './pages/nappeProfond/ModifyNappep.jsx'
import NappeProMap from './pages/nappeProfond/EmplacNappeP.jsx'

import PedologieMap from './pages/pedologie/EmplacPedologie.jsx'
import ModifyPed from './pages/pedologie/ModifyPed.jsx'
import Pedologie from './pages/pedologie/Pedologie.jsx'
import VertisolMap from './pages/vertisol/EmplacVertisol.jsx'
import ModifyVertisol from './pages/vertisol/ModifyVertisol.jsx'
import Vertisol from './pages/vertisol/VertisolBZ.jsx'
import Climat from './pages/climat/Climat.jsx'
import ClimatMap from './pages/climat/Climat.jsx'
import ModifyClimat from './pages/climat/ModifyClimat.jsx'
import AddClimat from './pages/climat/AddClimat.jsx'
import AddNappeph from './pages/nappePhreatique/AddNappeph.jsx'
import AddNappep from './pages/nappeProfond/AddNappep.jsx'
import Addpedologie from './pages/pedologie/Addpedologie.jsx'
import Addvertisol from './pages/vertisol/AddVertisol.jsx'
import Delegation from './pages/delegation/Delegation.jsx'
import AddDelegation from './pages/delegation/AddDelegation.jsx'
import ModifyDelegation from './pages/delegation/ModifyDelegation.jsx'
import DelegationMap from './pages/delegation/EmplcDelegation.jsx'
import GeologieMap from './pages/geologie/EmplcGeologie.jsx'
import Geologie from './pages/geologie/geologie.jsx'
import ModifyGeologie from './pages/geologie/ModifyGeologie.jsx'
import AddGeologie from './pages/geologie/AddGeologie.jsx'
import CNBZMap from './pages/cn_bizerte/EmplCN.jsx'
import TDSChart from './pages/TDSchart.jsx'




const App = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <AppContextProvider> 
        
        <ToastContainer />
        <Routes>
        <Route path='/navbar' element={<Navbar />} />

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/VisulisationSensor' element={<VisualisationSensor/>} />
        <Route path='/dashboardAdmin' element={<DashboardAdmin/>} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/data-display' element={<DataDisplay />} />
       

        <Route path='/bizerte' element={<BizerteMap />} />

         <Route path='/barrage' element={<Barrages />} />
        <Route path='/Addbarrages' element={<AddBarrages />} />
        <Route path='/EmpB' element={<BarragesMap />} />
        <Route path='/ModifyBarrage' element={<ModifyBarrage />} />

        <Route path='/forages' element={<Forages />} />
        <Route path='/EmpF' element={<ForagesMap />} />
        <Route path='/AddForages' element={<AddForages />} />
        <Route path='/ModifyForages' element={<ModifyForages />} />

        <Route path='/nappes' element={<Nappe_Ph />} />
        <Route path='/ModifyNappeph' element={<ModifyNappeph />} />
        <Route path='/AddNappeph' element={<AddNappeph />} />
        <Route path='/EmpNappeph' element={<NappePhMap />} />

        

        <Route path='/nappepro' element={<Nappepro />} />
        <Route path='/ModifyNappep' element={<ModifyNappep />} />
          <Route path='/AddNappep' element={<AddNappep />} />
        <Route path='/EmpNappepro' element={<NappeProMap />} />

        <Route path='/pedologie' element={<Pedologie />} />
        <Route path='/ModifyPed' element={<ModifyPed />} />
        <Route path='/Addpedologie' element={<Addpedologie />} />
        <Route path='/EmpPedologie' element={<PedologieMap />} />

        <Route path='/EmpVertisol' element={<VertisolMap/>}/>
        <Route path='/ModifyVertisol' element={<ModifyVertisol/>}/>
        <Route path='/Addvertisol' element={<Addvertisol />} />
        <Route path='/vertisol' element={<Vertisol />} />


        <Route path='/climat' element={<Climat />} />
        <Route path='/ModifyClimat' element={<ModifyClimat />} />
        <Route path='/Addclimat' element={<AddClimat />} />
        <Route path='/EmpClimat' element={<ClimatMap />}/>

        <Route path='/delegation' element={<Delegation />} />
        <Route path='/AddDelegation' element={<AddDelegation />} />
        <Route path='/ModifyDelegation' element={<ModifyDelegation />} />
        <Route path='/EmpDelegation' element={<DelegationMap />}/>

         <Route path='/geologie' element={<Geologie />} />
        <Route path='/AddGeologie' element={<AddGeologie />} />
        <Route path='/ModifyGeologie' element={<ModifyGeologie />} />
        <Route path='/EmpGeologie' element={<GeologieMap />}/>

        

        <Route path='/EmpCN' element={<CNBZMap />}/>


                <Route path='/tdschart' element={<TDSChart />}/>




















      </Routes>
      </AppContextProvider>
    </div>
  )
}

export default App
