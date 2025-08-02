import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import ReportIssue from './Pages/Reportissue'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/report' element={<ReportIssue />} />
      </Routes>
    </div>
  )
}

export default App
