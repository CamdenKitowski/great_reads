// import { useState } from 'react'
import './css/App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Bookshelf from './pages/Bookshelf';
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';

function App() {

  return (
    <BookProvider>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes/:user_book_id" element={<Notes />} /> {/* The might need to add user_id later */}
          <Route path="/bookshelf" element={<Bookshelf />} />
        </Routes>
      </main>
    </BookProvider>
  )
}

export default App;
