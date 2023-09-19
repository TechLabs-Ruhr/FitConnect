import Register from './pages/Register';
import Login from './pages/Login'
import Search from './pages/Search'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Settings from './pages/Settings';
import ChatPage from './pages/ChatPage';
import Groups from './pages/Groups';
import './styles/style.scss';
import 'normalize.css';

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
          <Route path="chat" element={<ChatPage />} />
          <Route path="groups" element={<Groups />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

