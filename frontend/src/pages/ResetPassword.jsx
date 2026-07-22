import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../features/auth/authThunk";
import { EyeOff, Eye } from "lucide-react";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((state) => state.auth);
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (code.trim().length !== 6) {
      setLocalError("Code must be 6 dsigits");
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
        newPassword,
      )
    ) {
      setLocalError(
        "Password must be between 8 and 15 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, #, $, !)",
      );
      return;
    }
    if (newPassword !== confirPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    const result = await dispatch(resetPassword({ email, code, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email]);

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
              Reset Password
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className=""
                  value={code}
                  placeholder="Code"
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirPassword}
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
                Set new password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
