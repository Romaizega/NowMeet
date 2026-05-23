import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getMe,
  updateUsername,
  updatePassword,
} from "../features/auth/authThunk";
import { User, RotateCcwKey } from "lucide-react";
import { useEffect } from "react";

export default function AccountSettings() {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [succesMsg, setSuccesMsg] = useState("")

  const handleUsernameChange = async () => {
    if (username.trim().length < 3) {
      setLocalError("Username must ne at least 3 characters");
      return;
    }
    const result = await dispatch(updateUsername({ username }));
    if (updateUsername.fulfilled.match(result)) {
      dispatch(getMe());
      setSuccesMsg("Username update successfully")
      setUsername("")
    } else {
      setLocalError(result.payload)
    }
  };

  const handlepasswordChange = async () => {
    if (currentPassword === "") {
      setLocalError("You must enter your current password");
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
        newPassword,
      )
    ) {
      setLocalError(
        "Password must be at least 8 characters long and include at least one capital letter and one number",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    const result = await dispatch(
      updatePassword({ currentPassword, newPassword }),
    );
    if (updatePassword.fulfilled.match(result)) {
      dispatch(getMe());
      setSuccesMsg("Password changed successfuly!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setLocalError(result.payload)
    }
  };

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);
  
  useEffect(() => {
    if (succesMsg) {
      const timer = setTimeout(() => setSuccesMsg(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [succesMsg]);

  return (
    <>
      <div className="flex-1 bg-base-200 rounded-xl p-8">
        <h3 className="text-xl font-bold text-primary">Account Setting</h3>
        <p className="text-primary opacity-70 mb-6">
          {" "}
          Change your username, email or password
        </p>
        {succesMsg && <div className="alert alert-success mb-4">{succesMsg}</div>}
        {(localError || error) && (
          <div className="text-error text-sm text-center">
            <span>{localError || error}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary">Username</span>
            </label>
            <div className="text text-primary">
              <p className="text-sm opacity-70 mb-2">
                Current username: {user?.username}
              </p>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <User className=" w-7 h-7" />
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="grow"
              />
            </label>
            <button
              onClick={handleUsernameChange}
              className="btn btn-primary mt-4"
            >
              Save Username
            </button>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-primary">Password</span>
            </label>
            <div className="text text-primary">
              <p className="text-sm opacity-70 mb-2">
                Enter your current password
              </p>
            </div>

            <label className="input input-bordered flex items-center gap-2">
              <RotateCcwKey className=" w-7 h-7" />

              <input
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                className="grow"
              />
            </label>
            <span className="label-text text-primary text-sm mt-2 opacity-70">
              New Password
            </span>
            <label className="input input-bordered flex items-center gap-2">
              <RotateCcwKey className=" w-7 h-7" />
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="grow"
              />
            </label>
            <span className="label-text text-primary text-sm mt-2 opacity-70">
              Confirm New Password
            </span>

            <label className="input input-bordered flex items-center gap-2">
              <RotateCcwKey className=" w-7 h-7" />
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="grow"
              />
            </label>
            <button
              onClick={handlepasswordChange}
              className="btn btn-primary mt-4"
            >
              Save Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
