import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/authApi";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const email = localStorage.getItem("email");
  const inputs = useRef([]);
  useEffect(() => {
    if (!email) {
      toast.error("Please login first");
      navigate("/");
    }
  }, [email, navigate]);
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      return toast.error("Please enter complete OTP");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/verify-otp", {
        email,
        otp: finalOTP,
      });

      localStorage.setItem("token", data.token);

      toast.success(data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const { data } = await API.post("/auth/resend-otp", {
        email,
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("");

    const newOtp = ["", "", "", "", "", ""];

    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    if (digits.length < 6) {
      inputs.current[digits.length].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-600 p-5">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-white">
          Verify OTP
        </h1>

        <p className="text-center text-white/80 mt-2 mb-8">
          Enter the verification code sent to your email.
        </p>

        <div className="flex justify-between gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength={1}
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
w-12
h-14
md:w-14
md:h-16
rounded-xl
bg-white/15
border
border-white/30
text-white
text-2xl
font-bold
text-center
outline-none
transition-all
duration-300
focus:border-white
focus:bg-white/20
"
            />
          ))}
        </div>

        <button
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
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          disabled={timer > 0}
          onClick={async () => {
            await resendOTP();
            setTimer(30);
          }}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
            timer > 0
              ? "bg-white/20 text-white cursor-not-allowed"
              : "bg-blue-950 text-white hover:bg-black"
          }`}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
