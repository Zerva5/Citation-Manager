import React from "react";
import { useNavigate } from "react-router-dom";

enum RegisterError {
  NameRequired = "Name is required",
  EmailRequired = "Email is required",
  PasswordRequired = "Password is required",
  PasswordMismatch = "Passwords do not match",
  EmailInvalid = "Email is invalid",

  EmailExists = "Email already exists",
}


function validateRegister(name: string, email: string, password: string, confirmPassword: string): RegisterError[] {

  let errors: RegisterError[] = [];

  if (!name) {
    errors.push(RegisterError.NameRequired);
  }

  if (!email) {
    errors.push(RegisterError.EmailRequired);
  } else if (!email.includes("@")) {
    errors.push(RegisterError.EmailInvalid);
  }

  if (!password) {
    errors.push(RegisterError.PasswordRequired);
  }

  if (password !== confirmPassword) {
    errors.push(RegisterError.PasswordMismatch);
  }

  return errors;
}




function RegisterForm({
  handleRegister
}: {
  handleRegister: (
    name: string,
    email: string,
    password: string,

    onErrCallback: (res: Response) => void
  ) => void;
}) {
  const labelClassName = "text-sm font-bold text-gray-600 block";
  const formClassName = "w-full p-2 border border-gray-300 rounded mt-1"

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [registerErrors, setRegisterErrors] = React.useState<RegisterError[]>([]);

  function handleRegisterError(res: Response) {
    console.log(res);
  }


  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    handleRegister(name, email, password, handleRegisterError);
  }

  return (
    <div className="register">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="login space-y-6">
        <div>
          <label
            htmlFor="register-name"
            className={labelClassName}
          >
            Name
          </label>
          <input
            id="register-name"
            type="name"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={formClassName}
          />
        </div>
        <div>
          <label
            htmlFor="register-email"
            className={labelClassName}
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className={formClassName}
          />
        </div>
        <div>
          <label
            htmlFor="register-password"
            className={labelClassName}
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={formClassName}
          />
        </div>
        <div>
          <label
            htmlFor="register-confirm-password"
            className={labelClassName}
          >
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className={formClassName}
          />
        </div>
        <div className="flex">
          <button className="w-full py-2 px-4 bg-accent hover:bg-blue-700 rounded-md text-white">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}


export default function RegisterPage() {

  const navigate = useNavigate();

  async function handleRegister(

    name: string,
    email: string,
    password: string,
    onErrCallback: (res: Response) => void
  ) {

    const response = await fetch('http://localhost:8000/public/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "email": email, "password": password, "name": name}),
    });

    if (response.ok) {

      // navigate("/login");

    } else {
      onErrCallback(response);
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

          <RegisterForm handleRegister={handleRegister} />

        </div>
      </div>
    </div>
  );
}
