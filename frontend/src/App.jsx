// import { useState } from 'react'
import './css/App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Bookshelf from './pages/Bookshelf';
import NavBar from './components/NavBar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import EnterEmail from './pages/EnterEmail';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';
import { AuthProvider } from './contexts/AuthContext';


function App() {

  const location = useLocation();
  const isAuthPage = location.pathname === '/' ||
    location.pathname === '/signup' ||
    location.pathname === '/enterEmail' ||
    location.pathname === '/resetPassword'
    
  return (
    <AuthProvider>
      <BookProvider>
        {!isAuthPage && <NavBar />}
        <main className='main-content'>
          <Routes>
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/enterEmail" element={<EnterEmail />} />
            <Route path="/notes/:user_book_id" element={<Notes />} />
            <Route path="/bookshelf/:status" element={<Bookshelf />} />
          </Routes>
        </main>
      </BookProvider>
    </AuthProvider>
  )
}

export default App;