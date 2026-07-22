import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authThunk";
import { EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please fill in all the fields");
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate("/profile");
  };
  
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <>
      <div className=" flex items-center justify-center min-h-screen">
        <div className=" card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            {(localError || error) && (
              <div className="text-error text-sm text-center">
                <span>{localError || error}</span>
              </div>
            )}
            <h2 className="card-title justify-center text-2xl"> Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label htmlFor="">
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="input  flex items-center gap-2 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
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
              <button type="submit" className="btn btn-neutral w-full mt-2">
                Login
              </button>
            </form>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline opacity-50">
            Forgot password?
          </Link>
          </div>
        </div>
      </div>
    </>
  );
}
