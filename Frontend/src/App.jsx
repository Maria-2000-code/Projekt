import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Projekt from './pages/Projekt'
import Projektdetail from './pages/Projektdetail'
import Benutzer from './pages/Benutzer'
import Profil from './pages/Profil'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login/>} />
	  <Route path="/projekt" element={<Projekt/>} />
	  <Route path="/projekt/:id" element={<Projektdetail />} />
	  <Route path="/benutzer" element={<Benutzer/>} />
	  <Route path="/profil" element={<Profil/>} />
    </Routes>
  )
}

export default App