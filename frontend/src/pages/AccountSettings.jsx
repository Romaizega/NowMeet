import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMe, updateUsername } from "../features/auth/authThunk";
import { User } from "lucide-react";

export default function AccountSettings() {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleUsernameChange = async () => {
    if (username.trim().length < 3) {
      setLocalError("Username must ne at least 3 characters");
      return;
    }
    const result = await dispatch(updateUsername({ username }));
    if (updateUsername.fulfilled.match(result)) {
      dispatch(getMe());
    }
  };

  return (
    <>
      <div className="flex-1 bg-base-200 rounded-xl p-8">
        <h3 className="text-xl font-bold text-primary">Account Setting</h3>
        <p className="text-primary opacity-70 mb-6">
          {" "}
          Change your username, email or password
        </p>
        {(localError || error) && (
          <div className="text-error text-sm text-center">
            <span>{localError || error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
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
        </div>
      </div>
    </>
  );
}
