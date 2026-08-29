import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, KeyRound, Zap } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getRole } from "../../data/roles";

export default function AdminLogin() {
  const { admin: loggedInAdmin, loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/admin";

  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const adminRole = getRole("admin");

  if (loggedInAdmin) {
    return <Navigate to={destination} replace />;
  }

  const finishLogin = (finalName, finalPhone) => {
    loginAdmin({ name: finalName, phone: finalPhone });
    navigate(destination, { replace: true });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^\d{10}$/.test(phone.trim())) return setError("Enter a valid 10-digit mobile number.");
    setError("");
    setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp.trim())) return setError("Enter the 4-digit OTP.");
    setError("");
    finishLogin(name, phone);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center text-2xl font-extrabold text-white">
          TRIN<span className="text-brand-500">.</span>TA
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="bg-navy-900 px-6 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="mt-3 text-xl font-extrabold text-white">Admin Portal Sign In</h1>
            <p className="mt-1 text-xs text-slate-400">Restricted access. Authorized administrators only.</p>
          </div>

          <div className="px-6 pt-5">
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy-800" />
              <div>
                <p className="text-sm font-bold text-navy-900">{adminRole.pitchTitle}</p>
                <p className="mt-0.5 text-xs text-slate-500">{adminRole.pitchDesc}</p>
              </div>
            </div>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="px-6 pb-6 pt-5">
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Admin Full Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="e.g. Trinita Admin"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>

              <label className="mt-4 block text-sm">
                <span className="font-semibold text-navy-800">Admin Mobile Number (OTP Verification)</span>
                <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 py-2.5 focus-within:border-brand-500">
                  <span className="mr-2 font-semibold text-slate-500">+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    type="tel"
                    placeholder="9840000000"
                    className="w-full text-sm font-semibold text-navy-900 focus:outline-none"
                  />
                </div>
              </label>

              {error && <p className="mt-3 text-xs font-semibold text-brand-600">{error}</p>}

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white hover:bg-brand-700"
              >
                Send One-Time Password (OTP)
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-slate-500">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Demo Access
                </p>
                <button
                  type="button"
                  onClick={() => finishLogin(adminRole.demoName, adminRole.demoPhone)}
                  className="mt-3 w-full rounded-lg bg-navy-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-navy-800"
                >
                  Sign In as {adminRole.demoName}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="px-6 pb-6 pt-5">
              <p className="text-sm text-slate-500">
                Enter the OTP sent to <span className="font-bold text-navy-900">+91 {phone}</span>
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="0000"
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-3 text-center text-2xl font-extrabold tracking-[0.5em] text-navy-900 focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-2 text-center text-xs text-slate-400">Demo mode — enter any 4 digits to continue.</p>

              {error && <p className="mt-3 text-xs font-semibold text-brand-600">{error}</p>}

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white hover:bg-brand-700"
              >
                Verify &amp; Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="mt-3 w-full text-center text-xs font-semibold text-slate-500 hover:text-navy-800"
              >
                Change mobile number
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Not an admin?{" "}
          <Link to="/" className="font-semibold text-brand-500 hover:underline">
            Return to Trin.ta
          </Link>
        </p>
      </div>
    </div>
  );
}
