import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authThunk";
import { EyeOff, Eye } from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Invalid email format");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&_^()-])[A-Za-z\d@.#$!%*?&_^()-]{8,}$/.test(
        password,
      )
    ) {
      setLocalError(
        "Password must be minimum  8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await dispatch(registerUser({ username, email, password }));

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify-email");
    }
  };
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            {(localError || error) && (
              <div className="text-error text-sm text-center">
                <span>{localError || error}</span>
              </div>
            )}
            <h2 className="card-title justify-center text-2xl">
              {" "}
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <Eye
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {showConfirmPassword ? (
                  <Eye
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  />
                )}
              </label>
              <button type="submit" className="btn btn-neutral w-full mt-2">
                Sign Up
              </button>
            </form>
            <button
              type="button"
              className="btn btn-outline w-full mt-2"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`)
              }
            >
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
