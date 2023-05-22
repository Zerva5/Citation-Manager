import React, { useState } from "react";
import Footer from "../Footer";
import RegisterForm from "../RegisterForm";
import { BrowserRouter as Router, Route, RouteMatch } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { User } from "../../DataClasses";

enum LoginErrorType {
  None,
  InvalidPassword,
  InvalidEmail,
}

function LoginForm({
  handleLogin,
}: {
  handleLogin: (
    email: string,
    password: string,
    onErrCallback: (res: Response) => void
  ) => void;
}) {

  const navigate = useNavigate();

  const labelClassName = "text-sm font-bold text-gray-600 block";
  const formClassName = "w-full p-2 border border-gray-300 rounded mt-1"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(LoginErrorType.InvalidPassword);

  function handleLoginError(res: Response) {
    setLoginError(LoginErrorType.InvalidPassword);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    handleLogin(email, password, handleLoginError)
  }

  return (

    <div className="login" >
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="login space-y-6">
        <div>
          <label
            htmlFor="email"
            className={labelClassName}
                      >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            className={formClassName}
          />

          {/* Email error */}
          {(loginError == LoginErrorType.InvalidEmail &&
            <h2 className="text-red-500">Invalid email!</h2>
          )}

        </div>
        <div>
          <label
            htmlFor="password"
            className={labelClassName}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formClassName}
          />
          {/* Password error */}
          {(loginError == LoginErrorType.InvalidPassword &&
            <h2 className="text-red-500">Invalid password!</h2>
          )}
        </div>
        <div className="flex">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-accent hover:bg-accent-hover rounded-md text-white text-lg"
          >
            Login
          </button>
        </div>
      </form>
      <h1 className="text-center text-md my-2">Or</h1>
      <button
        onClick={() => { navigate("/register")}}
        //type=""
        className="w-full py-2 px-4 bg-gray-300 hover:bg-accent-alt-hover rounded-md text-black text-lg"
      >
        Create Account
      </button>
    </div>
  );
}


export default function LoginPage({ setUser, setLoading }: { setUser: (user: User) => void, setLoading: (loading: boolean) => void }) {

  const navigate = useNavigate();

  async function handleLogin(
    email: string,
    password: string,
    onErrCallback: (res: Response) => void
  ) {
    setLoading(true);

    const response = await fetch('http://localhost:8000/public/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "email": email, "password": password }),
    });


    if (response.ok) {
      const data = await response.json();
      setLoading(false);
 
      // Save tokens in secure storage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // create user Object
      const user = new User(data.name, data.email);

      // set user
      setUser(user);

      // Redirect to home page
      navigate('/home');


    } else {
      onErrCallback(response);
      
      setLoading(false);
    }
  }

  return (
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: "url(https://via.placeholder.com/150)" }}
    >
      <div className="backdrop-filter backdrop-blur-md bg-opacity-30 absolute inset-0" />
      <div className="relative min-h-screen flex items-center p-6">
        <div className="absolute w-full max-w-md  m-6 mx-auto rounded-2xl shadow-lg p-10 bg-white">

          <LoginForm handleLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
}
