import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import Login from './Pages/Login';
import ChatPage from './Pages/Chat';

function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path ="/" element={<Home/>}/>
          <Route path ="/signup" element={<SignUp/>}/>
          <Route path ="/login" element={<Login/>}/>
          <Route path ="/chat" element={<ChatPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
