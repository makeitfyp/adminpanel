import './App.css';
import React, {useState} from 'react';
import { Route,BrowserRouter as Router, Routes, Redirect, Link } from 'react-router-dom';
import Dashboard from './Dashboard.js'
import Login from './Login.js'
function App() {
 const [userName,setUserName] = useState('')
 const [password,setPassword] = useState('')

  return (
    <Router>
      <Routes>
        <Route path='/Dashboard/:signIn/:uname' element={<Dashboard />}/>
        <Route path='/' element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;
