import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';


function App() {
  return (
      <Router>
        <div className="App">
          <header>
            <img src={logo} className="App-logo" alt="logo" />

          </header>
          <div>
            <Link to="/">Home Page (FIB CALCULATOR)</Link>
            <Link to="/axillary-page">Axillary Page</Link>
            <Route exact path="/" component={Fib}/>
            <Route path="/axillary-page" component={OtherPage}/>
          </div>
        </div>
      </Router>
  );
}

export default App;
