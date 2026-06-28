import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/authApi";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.data);
    } catch (error) {
      toast.error("Session Expired");

      localStorage.clear();

      navigate("/");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.clear();

      toast.success("Logout Successfully");

      navigate("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-600">
        <div className="w-14 h-14 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-600 flex items-center justify-center p-5">
      <div className="w-full max-w-lg rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white text-blue-700 text-4xl font-bold flex items-center justify-center shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white">Welcome</h1>

        <p className="text-center text-white/80 mb-8">Successfully Logged In</p>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm">Full Name</p>
            <h3 className="text-white font-semibold text-lg">{user.name}</h3>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm">Email</p>
            <h3 className="text-white font-semibold">{user.email}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-sm">Phone</p>

              <h3 className="text-white font-semibold">{user.phoneNumber}</h3>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-sm">Verified</p>

              <h3 className="text-green-300 font-semibold">
                {user.isVerified ? "Verified" : "Pending"}
              </h3>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm">Address</p>

            <h3 className="text-white font-semibold">{user.address}</h3>
          </div>
        </div>

        <button
          onClick={logout}
          className="
w-full
mt-8
py-3
rounded-xl
bg-red-500
hover:bg-red-600
text-white
font-semibold
transition-all
duration-300
hover:scale-[1.02]
"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
