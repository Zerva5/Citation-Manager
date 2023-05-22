import React from "react";
import "./App.css";
import LoginPage from "./components/pages/LoginPage";
import { BrowserRouter as Router, Route, Routes, redirect } from 'react-router-dom';
import RegisterPage from "./components/pages/RegisterPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import UserHomePage from "./components/pages/UserHomePage";
import { User } from "./DataClasses";
import Loading from "./components/Loading";

function RedirectTo({url} : {url:string}) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
}

function App() {
  // Global app states
  const [user, setUser] = React.useState<User|null>(null);
  const [loading, setLoading] = React.useState(false);





  return (
    <>
      <div className="">
        {(loading && <Loading />)}
        <Router>
          <Routes>
            {/* If user is logged in don't redirect to login*/}
            (user ? <Route path="/" element={<RedirectTo url="/home" />} /> : <Route path="/" element={<RedirectTo url="/login"/>} />)

            {/* If no user then redirect /home to /login */}
            (user ? <Route path="/home" Component={UserHomePage}/> : <Route path="/home" element={<RedirectTo url="/login"/>} />)

            
            <Route path="/register" Component={RegisterPage} />
            <Route path="/login" element={<LoginPage setUser={setUser} setLoading={setLoading}/>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
export default App;
