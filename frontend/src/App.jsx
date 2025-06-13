// import { useState } from 'react'
import './css/App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Bookshelf from './pages/Bookshelf';
import NavBar from './components/NavBar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';
import { AuthProvider } from './contexts/AuthContext';


function App() {

  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup'
  return (
    <AuthProvider>
      <BookProvider>
        {!isAuthPage && <NavBar />}
        <main className='main-content'>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/notes/:user_book_id" element={<Notes />} />
            <Route path="/bookshelf" element={<Bookshelf />} />
          </Routes>
        </main>
      </BookProvider>
    </AuthProvider>
  )
}

export default App;