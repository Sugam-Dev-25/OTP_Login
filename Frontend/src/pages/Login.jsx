import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/send-otp", {
        email,
      });

      toast.success(data.message);

      // Email save for OTP page
      localStorage.setItem("email", email);

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-600 p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8"
      >
        <>
          <h1 className="text-4xl font-bold text-center text-white">
            Welcome Back
          </h1>

          <p className="text-center text-white/80 mt-2 mb-8">
            Login with your email to receive an OTP
          </p>
        </>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
w-full
rounded-xl
border
border-white/30
bg-white/15
px-4
py-3
mb-5
text-white
placeholder:text-white/60
outline-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
        />

        <button
          disabled={loading}
          className="
w-full
py-3
rounded-xl
font-semibold
bg-white
text-blue-700
transition-all
duration-300
hover:scale-[1.02]
disabled:opacity-60
"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="text-center mt-6 text-white/80">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="font-semibold text-white cursor-pointer ml-2 hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
