
import './App.css'
import { Route, Routes } from 'react-router-dom'

import Pdf from './pages/Pdf'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Pdf />} />
      </Routes>
    </>
  )
}

export default App
