import './style.scss';
import 'normalize.css';
import Register from './pages/Register';
import Login from './pages/Login'
import Search from './pages/Search'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Groups from './pages/Groups';

function App() {
  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }

    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<ProtectedRoute>
                                  <Search />
                                </ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat" element={<Chat />} />
          <Route path="groups" element={<Groups />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

