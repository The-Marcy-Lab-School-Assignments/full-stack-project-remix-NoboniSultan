import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchMe, fetchLogout } from './adapters/authAdapters';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BookPage from './components/BookPage';
import AuthPage from './components/AuthPage';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRehydrating, setIsRehydrating] = useState(true);

  useEffect(() => {
    fetchMe().then(setCurrentUser).finally(() => setIsRehydrating(false));
  }, []);

  const handleLogout = async () => {
    await fetchLogout();
    setCurrentUser(null);
  };

  if (isRehydrating) return <div className="app-loading"><span>বই</span></div>;

  return (
    <BrowserRouter>
      {currentUser && <Navbar currentUser={currentUser} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={
          currentUser ? <HomePage /> : <Navigate to="/auth" />
        } />
        <Route path="/books" element={
          currentUser
            ? <BookPage currentUser={currentUser} onLogout={handleLogout} />
            : <Navigate to="/auth" />
        } />
        <Route path="/auth" element={
          currentUser
            ? <Navigate to="/" />
            : <AuthPage onLogin={setCurrentUser} onRegister={setCurrentUser} />
        } />
      </Routes>
    </BrowserRouter>
  );
}