import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Garage from './pages/Garage.jsx'
import Rishabh from './pages/Rishabh.jsx'
import Connect from './pages/Connect.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/garage" element={<Garage />} />
      <Route path="/rishabh" element={<Rishabh />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
