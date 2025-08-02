import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />} />
      </Routes>
    </div>
  )
}

export default App
