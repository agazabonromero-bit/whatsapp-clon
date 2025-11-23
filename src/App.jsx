import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import PantallaLogueo from './components/PantallaLogueo'
import PantallaLogTel from './components/PantallaLogTel'
import PantallaCargando from './components/PantallaCargando'
import PruebaPantallaChats from './components/PruebaPantallaChats'
import PantallaCodigoTel from './components/PantallaCodigoTel';
import SeleccionUsuario from './components/SeleccionUsuario';


function App() {
  

  return (

    <div className='app'>
      <Router>
        <Routes>
          <Route path='/' element={<PantallaLogueo />} />
          <Route path='/phone' element={<PantallaLogTel/>}/>
          <Route path="/seleccion" element={<SeleccionUsuario />} />
          <Route path="/chats" element={<PruebaPantallaChats />} />
          <Route path='/loading' element={<PantallaCargando/>}/>
          <Route path='/code' element={<PantallaCodigoTel/>}/>
        </Routes>
      </Router>
    </div>

  )
}

export default App

