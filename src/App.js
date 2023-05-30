import './App.css';
import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar';
import CreateTodo from './CreateTodo';
import Todo from './Todo';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <Router>
      <div>
        <div className='nav'>
          <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </div>
        <div>
          <div>
            <Routes>
              <Route exact path='/' element={<Signup />}></Route>
              <Route exact path='/signup' element={<Signup />}></Route>
              <Route exact path='/login' element={<Login userEmail={userEmail} setUserEmail={setUserEmail} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
              <Route exact path='/create' element={loggedIn ? <CreateTodo userEmail={userEmail} /> : <Login userEmail={userEmail} setUserEmail={setUserEmail} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
              <Route exact path='/todo' element={loggedIn ? <Todo /> : <Login userEmail={userEmail} setUserEmail={setUserEmail} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
