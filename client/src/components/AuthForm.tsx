import React, { useState } from "react";
import Button from "./Button";

const AuthForm: React.FC = () => {
  const [login, setLogin] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(login ? "Logging in..." : "Signing up...");
  };

  const toggleAuthMode = () => {
    setLogin((prev) => !prev);
  };

  return (
    <div className="form-container wrapper">
      <form
        onSubmit={handleAuth}
        className="w-11/12 max-w-2xl flex flex-col gap-6 rounded-lg mx-auto shadow-lg py-6 px-5"
      >
        <h1 className="text-xl font-semibold">{login ? "Login" : "Sign Up"}</h1>

        {!login && (
          <div className="flex flex-col gap-2 text-[13px]">
            <label htmlFor="username" className="font-semibold">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="border border-slate-300 rounded-md w-full p-2"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 text-[13px]">
          <label htmlFor="email" className="font-semibold">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="border border-slate-300 rounded-md w-full p-2"
          />
        </div>

        <div className="flex flex-col gap-2 text-[13px]">
          <label htmlFor="password" className="font-semibold">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="border border-slate-300 rounded-md w-full p-2"
          />
        </div>

        <div>
          <Button
            children={login ? "Login" : "Sign Up"}
            className="bg-blue-600 w-full text-sm text-white py-2 px-1.5"
            type="submit"
          />
        </div>

        <div className="text-sm text-center font-semibold ">
          {login ? (
            <>
              <span className="text-gray-700">Don't have an account? </span>
              <button
                className="text-blue-600 font-sm underline"
                onClick={toggleAuthMode}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-700"> Already have an account? </span>
              <button
                className="text-blue-600 font-sm underline"
                onClick={toggleAuthMode}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
