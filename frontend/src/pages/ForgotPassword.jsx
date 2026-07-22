import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../features/auth/authThunk";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email) {
      setLocalError("Please enter your email");
      return;
    }
    const result = await dispatch(
      forgotPassword({ email}),
    );
    if (forgotPassword.fulfilled.match(result)) {
      navigate("/reset-password", {state: {email}});
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
            Forgot Password
          </h2>
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
            <button type="submit" className="btn btn-neutral w-full mt-2">
              Sent Code
            </button>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}
