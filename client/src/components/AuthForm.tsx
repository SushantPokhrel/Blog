import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Button from "./Button";
type FormDataTypes = {
  username?: string;
  email: string;
  password: string;
};
const AuthForm: React.FC = () => {
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState<FormDataTypes>({
    username: "",
    email: "",
    password: "",
  });
  // google login function
  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google login success:", credentialResponse);
      fetch(`${backendUrl}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: credentialResponse.code }),
      });
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
    flow: "auth-code", //  'auth-code' for server-side exchange logic
  });
  // submit the form data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = login
      ? { email: formData.email, password: formData.password }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

    const fullUrl = login
      ? `${backendUrl}/api/auth/login`
      : `${backendUrl}/api/auth/signup`;
    const response = await fetch(`${fullUrl}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const toggleAuthMode = () => {
    setLogin((prev) => !prev);
  };

  return (
    <div className="form-container wrapper">
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-w-2xl flex flex-col gap-4 rounded-lg mx-auto shadow-lg py-6 px-5"
      >
        <h1 className="text-xl font-semibold">{login ? "Login" : "Sign Up"}</h1>

        {!login && (
          <div className="flex flex-col gap-2 text-[13px]">
            <label htmlFor="username" className="font-semibold">
              Username:
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              className="border border-slate-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={handleChange}
            className="border border-slate-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={handleChange}
            className="border border-slate-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Button
            children={login ? "Login" : "Sign Up"}
            className="bg-blue-600 w-full text-sm text-white py-2 px-1.5"
            type="submit"
          />
        </div>
        {/* //google auth */}
        <div className="goggleAuth text-sm text-center font-semibold ">
          <div className="flex justify-center items-center gap-1">
            <div className=" border-t border-gray-500 flex-1"></div>{" "}
            <p className="">or</p>
            <div className=" border-t border-gray-500 flex-1"></div>
          </div>
          <Button
            onClick={googleLogin}
            className="flex w-full p-2 active:bg-blue-300 justify-center gap-2 text-gray-700 cursor-pointer"
          >
            <FcGoogle className="size-5" /> <span>Continue with Google</span>
          </Button>
        </div>
        <div className="text-sm text-center font-semibold ">
          {login ? (
            <>
              <span className="text-gray-700">Don't have an account? </span>
              <Button
                className="text-blue-600 font-sm underline"
                onClick={toggleAuthMode}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-700"> Already have an account? </span>
              <Button
                className="text-blue-600 font-sm underline"
                onClick={toggleAuthMode}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
