import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", formData);

      toast.success(data.message);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
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
        <h1 className="text-4xl font-bold text-center text-white">
          Create Account
        </h1>

        <p className="text-center text-white/80 mt-2 mb-8">
          Register to continue
        </p>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
border-white/30
bg-white/15
px-4
py-3
text-white
placeholder:text-white/60
outline-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
border-white/30
bg-white/15
px-4
py-3
text-white
placeholder:text-white/60
outline-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
border-white/30
bg-white/15
px-4
py-3
text-white
placeholder:text-white/60
outline-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
          />
        </div>

        <div className="mb-6">
          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            className="
w-full
rounded-xl
border
border-white/30
bg-white/15
px-4
py-3
text-white
placeholder:text-white/60
outline-none
resize-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
          />
        </div>

        <button
          disabled={loading}
          className="
  w-full
  py-3
  rounded-xl
  font-semibold
  bg-white
  text-blue-700
  hover:scale-[1.02]
  transition-all
  duration-300
  disabled:opacity-60
  "
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p className="text-center mt-6 text-white/80">
          Already have an account?
          <span
            onClick={() => navigate("/")}
            className="font-semibold text-white cursor-pointer ml-2 hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
