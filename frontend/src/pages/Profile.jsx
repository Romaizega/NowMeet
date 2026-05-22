import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getMe } from "../features/auth/authThunk";
import heroImgProfile from "../assests/hero_profile.png";
import {
  Pencil,
  User,
  LockKeyhole,
  Bell,
  HatGlasses,
  Mail,
  CalendarDays,
  Image,
  NotebookPen,
} from "lucide-react";
import axios from "../services/axios";
import AccountSettings from "../pages/AccountSettings";

export default function Profile() {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    about: "",
    photo: "",
  });
  const [photo, setPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth?.slice(0, 10) || "",
        about: user.about || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const birth = new Date(form.date_of_birth);
    const now = new Date();
    if (!form.date_of_birth) {
      return setLocalError("You must fill in your date of bith");
    }
    if (birth.getFullYear() > now.getFullYear()) {
      return setLocalError("Date of birth cannot be in the future");
    }
    if (now.getFullYear() - birth.getFullYear() < 18) {
      return setLocalError("You must be at least 18");
    }
    try {
      const formData = new FormData();
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("date_of_birth", form.date_of_birth);
      formData.append("about", form.about);
      if (photo) formData.append("photo", photo);

      await axios.put("/profiles/profile", formData);
      dispatch(getMe());
      setEdit(false);
      setLocalError("");
    } catch (error) {
      setLocalError(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden mb-8 h-48"
        style={{
          backgroundImage: `url(${heroImgProfile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-between p-8 h-full">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-40 rounded-full">
                <img
                  src={
                    user?.photo
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/${user.photo}`
                      : "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                  }
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold">My Profile</h2>
              <p className="text-sm opacity-70 text-primary">
                Manage your personal information and how
                <br />
                others see you on NowMeet
              </p>
            </div>
          </div>
          <button
            onClick={() => setEdit(!edit)}
            className="btn btn-outline btn-primary self-end"
          >
            <Pencil className="w-4 h-16" />
            Edit Profile
          </button>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="w-64">
          <ul className="menu bg-base-100 rounded-xl shadow-xl">
            <li>
              <a
                className={`text-xl ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User />
                Profile information
              </a>
            </li>
            <li>
              <a
                className={`text-xl ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <LockKeyhole />
                Account Settings
              </a>
            </li>
            <li>
              <a
                className={`text-xl ${activeTab === "notification" ? "active" : ""}`}
                onClick={() => setActiveTab("notification")}
              >
                <Bell />
                Notifications
              </a>
            </li>
            <li>
              <a
                className={`text-xl ${activeTab === "privacy" ? "active" : ""}`}
                onClick={() => setActiveTab("privacy")}
              >
                <HatGlasses />
                Privacy
              </a>
            </li>
          </ul>
        </div>
        {activeTab === "profile" && (
          <>
            <div className=" flex-1 bg-base-200 rounded-xl p-8">
              <div>
                <a className=" text-primary text-xl font-bold">
                  Personal information
                </a>
                <p className="text-primary opacity-70">
                  This information will be visible for other users
                </p>
              </div>
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
                  <label className="input input-bordered flex items-center gap-2">
                    <User className="w-7 h-7" />
                    <input
                      type="text"
                      value={user?.username || ""}
                      disabled
                      className="grow"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <Mail className="w-7 h-7" />
                    <input
                      type="text"
                      value={user?.email || ""}
                      disabled
                      className="grow"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">First name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <User className="w-7 h-7" />
                    <input
                      name="first_name"
                      onChange={handleChange}
                      type="text"
                      value={form.first_name}
                      disabled={!edit}
                      className="grow"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">Last name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <User className="w-7 h-7" />
                    <input
                      onChange={handleChange}
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      disabled={!edit}
                      className="grow"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">
                      Date of birth
                    </span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <CalendarDays className="w-7 h-7" />
                    <input
                      onChange={handleChange}
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      disabled={!edit}
                      className="grow"
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">Photo</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <Image className="w-7 h-7" />
                    <input
                      onChange={handleFileChange}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={!edit}
                      className="grow"
                    />
                  </label>
                </div>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-primary">About</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  onChange={handleChange}
                  name="about"
                  value={form.about}
                  disabled={!edit}
                  rows={3}
                  maxLength={150}
                  placeholder="Tell others about yourself..."
                />
                <div className="label">
                  <span></span>
                  <span className="label-text-alt text-primary">
                    {form.about?.length || 0} / 150
                  </span>
                </div>
              </div>

              {edit && (
                <button onClick={handleSave} className="btn btn-primary mt-4">
                  Save Changes
                </button>
              )}
            </div>
          </>
        )}
        {activeTab === "account" && <AccountSettings/>}

        {activeTab === "notification" && (
          <div>
            <h3 className="text-xl font-bold text-primary">Notifications</h3>
          </div>
        )}
        {activeTab === "privacy" && (
          <div>
            <h3 className="text-xl font-bold text-primary">Privacy</h3>
          </div>
        )}

      </div>
    </>
  );
}
