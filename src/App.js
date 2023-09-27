import Register from './pages/login&register/Register';
import Login from './pages/login&register/Login'
import Search from './pages/search/Search'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Settings from './pages/settings/Settings';
import ChatPage from './pages/chat/ChatPage';
import Groups from './pages/groups/Groups';
import './styles/style.scss';
import 'normalize.css';
import { AppProvider } from './context/AppContext';

function App() {
  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }

    return children;
  }

  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;

