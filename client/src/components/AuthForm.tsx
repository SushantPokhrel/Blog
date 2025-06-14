import React, { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserContext } from "../contexts/UserContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const oauthRedirectUrl = import.meta.env.VITE_OAUTH_REDIRECT_URL;
import Button from "./Button";
type FormDataTypes = {
  username?: string;
  email: string;
  password: string;
};
const AuthForm: React.FC = () => {
  const [login, setLogin] = useState(true);
  const [processingDefault, setProcessingDefault] = useState(false);
  const [processingGoogle, setProcessingGoogle] = useState(false);
  const [formData, setFormData] = useState<FormDataTypes>({
    username: "",
    email: "",
    password: "",
  });
  const { setIsAuthenticated, setUser } = useUserContext();
  const focusRef = useRef<HTMLButtonElement | null>(null);

  // google login function
  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setProcessingGoogle(true);
      try {
        const response = await fetch(`${backendUrl}/api/auth/google`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: credentialResponse.code }),
        });
        const data = await response.json();
        if (response.ok) {
          const { username, email, picture, role, customUsername } = data;
          setUser({
            username,
            email,
            profilePhoto: picture,
            role,
            customUsername,
          });
          setIsAuthenticated(true);
          console.log(picture);
        } else {
          alert("Google Login failed, Try again");
        }
      } catch {
        alert("Google Login failed, Try again");
      } finally {
        setProcessingGoogle(false);
      }
    },
    onError: () => {
      alert("Google Login failed, Try again");
      setProcessingGoogle(false);
    },
    flow: "auth-code",
    redirect_uri: oauthRedirectUrl,
  });

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessingDefault(true);
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
    try {
      const response = await fetch(`${fullUrl}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status === 201) setLogin(true);
      if (response.status === 409) {
        alert(data.message);
        setLogin(true);
      }
      if (login && response.status === 200) {
        const { username, email, role, customUsername, picture } = data;
        setUser({
          username,
          email,
          role,
          customUsername,
          profilePhoto: picture,
        });
        setIsAuthenticated(true);
      }
      if (response.status === 404) {
        alert("User not found");
        setUser({
          email: "",
          username: "",
          profilePhoto: "",
          role: "",
          customUsername: "",
        });
        setIsAuthenticated(false);
      }
    } catch {
      setUser({
        email: "",
        username: "",
        profilePhoto: "",
        role: "",
        customUsername: "",
      });
      setIsAuthenticated(false);
    } finally {
      setProcessingDefault(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleAuthMode = () => setLogin((prev) => !prev);

  return (
    <div className="form-container wrapper">
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-w-lg flex flex-col gap-4 rounded-lg mx-auto shadow-sm py-6 px-5"
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

        <Button
          className="bg-blue-600 w-full text-sm text-white py-2 px-1.5 hover:bg-blue-700 flex justify-center items-center"
          type="submit"
          disabled={processingDefault || processingGoogle}
        >
          {processingDefault && (
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {login ? "Login" : "Sign Up"}
        </Button>

        {/* Google Auth */}
        <div className="goggleAuth text-sm text-center font-semibold">
          <div className="flex justify-center items-center gap-1">
            <div className="border-t border-gray-500 flex-1"></div>
            <p>or</p>
            <div className="border-t border-gray-500 flex-1"></div>
          </div>
          <Button
            ref={focusRef}
            onClick={() => !processingGoogle && googleLogin()}
            className="flex w-full p-2  focus:outline-blue-600 border hover:bg-blue-300 justify-center gap-2 text-gray-700 cursor-pointer items-center"
            disabled={processingDefault || processingGoogle}
          >
            {processingGoogle ? (
              <svg
                className="animate-spin mr-2 h-5 w-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <FcGoogle className="size-5" />
            )}
            <span>
              {processingGoogle ? "Processing…" : "Continue with Google"}
            </span>
          </Button>
        </div>

        <div className="text-sm text-center font-semibold">
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
              <span className="text-gray-700">Already have an account? </span>
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
