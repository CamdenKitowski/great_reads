// import { useState } from 'react'
import './css/App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </main>
    </>
  )
}

export default App
