import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import auth from "../utils/Firebase";
import Validate from "../utils/Validate";
import { addUser } from "../store/userSlice";
import LoginShimmerUI from "./LoginShimmerUI";
import loginBackground from "../utils/ChatGPT Image May 19, 2026, 08_11_23 PM.png";

const profileLogo =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='20' fill='%23ea580c'/%3E%3Cpath d='M28 60h40v8H28zM34 29h28a6 6 0 0 1 6 6v17H28V35a6 6 0 0 1 6-6z' fill='white'/%3E%3Ccircle cx='39' cy='42' r='4' fill='%23ea580c'/%3E%3Ccircle cx='57' cy='42' r='4' fill='%23ea580c'/%3E%3Cpath d='M42 52h12' stroke='%23ea580c' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E";

const loginHighlights = ["Telemetry", "Map View", "Alerts"];

const inputClass =
  "mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none transition-colors duration-150 placeholder:text-zinc-500 focus:border-orange-500";

const featureCardClass = "rounded-lg border border-white/10 bg-white/5 p-4";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const toggleSignup = () => {
    setIsSignIn((currentState) => !currentState);
    setErrorMessage(null);
  };

  const syncUserToStore = (user) => {
    const { uid, email: userEmail, displayName, photoURL } = user;

    dispatch(
      addUser({
        uid,
        email: userEmail,
        displayName,
        photoURL,
      })
    );
  };

  const handleAuth = async () => {
    const message = Validate(
      email.current.value,
      password.current.value,
      isSignIn ? null : name.current.value
    );

    if (message) {
      setErrorMessage(message);
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isSignIn) {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );

        syncUserToStore(user);
        navigate("/");
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );

      await updateProfile(user, {
        displayName: name.current.value,
        photoURL: profileLogo,
      });

      syncUserToStore({
        ...user,
        displayName: name.current.value,
        photoURL: profileLogo,
      });
      navigate("/");
    } catch (error) {
      setErrorMessage(error.code ? `${error.code} - ${error.message}` : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-zinc-950 bg-cover bg-center text-zinc-100"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {isLoading && (
        <LoginShimmerUI
          message={isSignIn ? "Signing you in..." : "Creating your operator account..."}
        />
      )}

      <div className="absolute inset-0 bg-black/65" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <section className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900/90 shadow-2xl lg:grid-cols-[1fr_420px]">
          <div className="hidden bg-zinc-950/80 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-orange-400/40 bg-gradient-to-br from-orange-500 via-orange-700 to-zinc-950 text-sm font-black shadow-lg shadow-orange-950/40">
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-zinc-950 bg-emerald-400" />
                  A
                </div>
                <div>
                  <p className="bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-2xl font-black leading-6 tracking-normal text-transparent">
                    AUTOMATA
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-normal text-zinc-400">
                    Command Center
                  </p>
                </div>
              </div>
              <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-normal">
                Secure access for your autonomous fleet.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
                Track robots across Indian cities, review alerts, and keep every unit mission-ready.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {loginHighlights.map((item) => (
                <div key={item} className={featureCardClass}>
                  <p className="text-xs text-zinc-300">{item}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-orange-500" />
                </div>
              ))}
            </div>
          </div>

          <form
            className="bg-zinc-900/95 p-6 text-zinc-100 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              handleAuth();
            }}
          >
            <div className="mb-7">
              <p className="text-sm font-semibold text-orange-500">AUTOMATA Access</p>
              <h2 className="mt-1 text-3xl font-bold tracking-normal">
                {isSignIn ? "Sign In" : "Create Account"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {isSignIn ? "Welcome back, operator." : "Create an operator profile."}
              </p>
            </div>

            {!isSignIn && (
              <input
                ref={name}
                type="text"
                placeholder="Full name"
                className={inputClass}
              />
            )}

            <input
              ref={email}
              type="email"
              placeholder="Email"
              className={inputClass}
            />

            <input
              ref={password}
              type="password"
              placeholder="Password"
              className={`${inputClass} mb-3`}
            />

            {errorMessage && (
              <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="my-2 w-full rounded-lg bg-orange-600 p-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>

            <button
              type="button"
              className="mt-4 text-sm font-medium text-orange-500 hover:text-orange-300"
              onClick={toggleSignup}
            >
              {isSignIn ? "New operator? Sign up now" : "Already have an account? Sign in"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
