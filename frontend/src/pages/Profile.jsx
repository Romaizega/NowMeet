import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getMe } from "../features/auth/authThunk";
import heroImgProfile from "../assests/hero_profile.png";
import { Pencil, User  } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

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
              <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">My Profile</h2>
            <p className="text-sm opacity-70 text-primary">Manage your personal information and how<br/>
              others see you on NowMeet
            </p>
          </div>
          </div>
        <button className="btn btn-outline btn-primary self-end">
          <Pencil className="w-4 h-16"/>
           Edit Profile
           </button>
        </div>
      </div>
        <div className="flex gap-8">
          <div className="w-64">
            <ul className="menu bg-base-100 rounded-xl shadow-xl">
              <li><a className="text-xl active"> 
                <User/>
                Profile information
                 </a></li>
                 <li>
                  <a>
                  </a>
                 </li>
            </ul>
          </div>
        </div>
    </>
  );
}
