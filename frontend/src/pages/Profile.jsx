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
import api from "../services/axios";
import AccountSettings from "../pages/AccountSettings";
import {
  addUserInterest,
  deleteUserInterest,
  getAllInterests,
  getUserInterests,
} from "../features/interest/interestThunk";
import groupByCategory from "../utils/groupByCategory";

export default function Profile() {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const {
    status: interestStatus,
    error: interestError,
    allInterests,
    userInterest,
  } = useSelector((state) => state.interest);
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
  const grouped = groupByCategory(allInterests);

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
      dispatch(getAllInterests());
      dispatch(getUserInterests(user.id));
    }
  }, [user, dispatch]);

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

      await api.put("/profiles/profile", formData);
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

  const handleInterest = async (interestId) => {
  if (userInterest.some(ui => ui.id === interestId)) {
    await dispatch(deleteUserInterest({ interest_id: interestId }))
  } else {
    await dispatch(addUserInterest({ interest_id: interestId }))
  }
  dispatch(getUserInterests(user.id))
}

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden mb-8 h-auto lg:h-48 py-6 lg:py-0"
        style={{
          backgroundImage: `url(${heroImgProfile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 p-4 sm:p-6 lg:p-8 h-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 lg:gap-6 text-center sm:text-left">
            <div className="avatar">
              <div className="w-24 sm:w-32 lg:w-40 rounded-full">
                <img
                  src={
                    user?.photo
                      ? `/uploads/${user.photo}`
                      : "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                  }
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">My Profile</h2>
              <p className="text-sm opacity-70 text-primary">
                Manage your personal information and how
                <br />
                others see you on NowMeet
              </p>
            </div>
          </div>
          <button
            onClick={() => setEdit(!edit)}
            className="btn btn-outline btn-primary w-full sm:w-auto self-auto sm:self-end"
          >
            <Pencil className="w-4 h-16" />
            Edit Profile
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-64">
          <ul className="menu bg-base-100 rounded-xl shadow-xl w-full">
            <li>
              <a
                className={`text-base lg:text-xl ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User />
                Profile information
              </a>
            </li>
            <li>
              <a
                className={`text-base lg:text-xl ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <LockKeyhole />
                Account Settings
              </a>
            </li>
            <li>
              <a
                className={`text-base lg:text-xl ${activeTab === "notification" ? "active" : ""}`}
                onClick={() => setActiveTab("notification")}
              >
                <Bell />
                Notifications
              </a>
            </li>
            <li>
              <a
                className={`text-base lg:text-xl ${activeTab === "privacy" ? "active" : ""}`}
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
            <div className="flex-1 bg-base-200 rounded-xl p-4 sm:p-6 lg:p-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary">Username</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <User className="w-5 h-5 lg:w-7 lg:h-7" />
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
                    <Mail className="w-5 h-5 lg:w-7 lg:h-7" />
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
                    <User className="w-5 h-5 lg:w-7 lg:h-7" />
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
                    <User className="w-5 h-5 lg:w-7 lg:h-7" />
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
                    <CalendarDays className="w-5 h-5 lg:w-7 lg:h-7" />
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
                    <Image className="w-5 h-5 lg:w-7 lg:h-7" />
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
                  className="textarea textarea-bordered w-full text-sm lg:text-base"
                  onChange={handleChange}
                  name="about"
                  value={form.about}
                  disabled={!edit}
                  rows={3}
                  maxLength={750}
                  placeholder="Tell others about yourself..."
                />
                <div className="label">
                  <span></span>
                  <span className="label-text-alt text-primary">
                    {form.about?.length || 0} / 750
                  </span>
                </div>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-primary"> Interests</span>
                </label>

                {edit ? (
                  Object.entries(grouped).map(([categoryName, interests]) => (
                    <div  key={categoryName} className="mt-3">
                      <h4 className="text-base lg:text-lg text-primary">{categoryName}</h4>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <span
                          onClick={()=> handleInterest(interest.id) }
                           key={interest.id}
                           className={userInterest.some(ui => ui.id === interest.id)
                             ? "cursor-pointer rounded-full bg-orange-400 px-2 lg:px-3 py-1 text-sm lg:text-base text-black "
                             : "cursor-pointer rounded-full border border-orange-400/30 px-2 lg:px-3 py-1 text-sm lg:text-base text-orange-300"}
                           >{interest.name}</span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : userInterest && userInterest.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userInterest.map((interest) => (
                      <span key={interest.id} className="text-primary badge rounded-full border border-orange-400 px-3 py-3 lg:py-4">
                        {interest.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary opacity-50">No interests yet</p>
                )}
              </div>

              {edit && (
                <button onClick={handleSave} className="btn btn-primary mt-4 w-full sm:w-auto">
                  Save Changes
                </button>
              )}
            </div>
          </>
        )}
        {activeTab === "account" && <AccountSettings edit={edit} />}

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
