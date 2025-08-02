import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Signup from './Pages/Signup'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/register' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
