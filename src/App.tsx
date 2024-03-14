import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePage from './components/Porfile';
import Navbar from './components/NavBar';
import Post from './components/Post';
import UpdatePost from './components/UpdatePost';
import ConnectionsList from './components/ConnectionList';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="ml-64">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/posts/:id" element={<Post/>} />
            <Route path="/update/:id" element={<UpdatePost/>} />
            <Route path="/connections" element={<ConnectionsList />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
