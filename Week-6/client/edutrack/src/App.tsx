import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  Dashboard  from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/manageusers' element={<ManageUsers />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
