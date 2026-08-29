import { useState } from "react";
import { X, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { ROLES } from "../../data/roles";
import { useAuth } from "../../context/AuthContext";

export default function AuthPortalModal({ open, onClose, onSuccess, initialRole = "buyer", roles }) {
  const { login } = useAuth();
  const [roleKey, setRoleKey] = useState(initialRole);
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const PUBLIC_ROLES = ROLES.filter((r) => (roles ? roles.includes(r.key) : r.key !== "admin"));

  if (!open) return null;

  const role = ROLES.find((r) => r.key === roleKey);

  const reset = () => {
    setStep("form");
    setName("");
    setPhone("");
    setOtp("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const finishLogin = ({ name: finalName, phone: finalPhone, roleKey: finalRoleKey }) => {
    const user = login({ name: finalName, phone: finalPhone, roleKey: finalRoleKey });
    reset();
    onSuccess?.(user);
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
    finishLogin({ name, phone, roleKey });
  };

  const handleQuickLogin = (r) => {
    finishLogin({ name: r.demoName, phone: r.demoPhone, roleKey: r.key });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-navy-950 px-6 pb-6 pt-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-5 top-5 text-white/70 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
            Trinita Auth Portal
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">Sign In to Trinita Properties</h2>
          <p className="mt-1 text-sm text-slate-300">
            Access owner contact numbers, manage listings &amp; builder portfolios
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 px-6 pt-5 sm:grid-cols-5">
          {PUBLIC_ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                setRoleKey(r.key);
                setStep("form");
                setError("");
              }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 text-xs font-bold transition-colors ${
                roleKey === r.key
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-slate-200 text-navy-800 hover:border-slate-300"
              }`}
            >
              <r.icon className={`h-5 w-5 ${roleKey === r.key ? "text-white" : r.iconColor}`} />
              {r.label}
            </button>
          ))}
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy-800" />
            <div>
              <p className="text-sm font-bold text-navy-900">{role.pitchTitle}</p>
              <p className="mt-0.5 text-xs text-slate-500">{role.pitchDesc}</p>
            </div>
          </div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="px-6 pb-6 pt-5">
            <label className="block text-sm">
              <span className="font-semibold text-navy-800">Your Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Karthik Venkat"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-semibold text-navy-800">Mobile Phone Number (OTP Verification)</span>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 py-2.5 focus-within:border-brand-500">
                <span className="mr-2 font-semibold text-slate-500">+91</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  type="tel"
                  placeholder="9840011223"
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
                Quick Demo 1-Click Role Logins:
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {PUBLIC_ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleQuickLogin(r)}
                    className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${r.demoChip}`}
                  >
                    Sign In as {r.label === "Buyer" ? "Homebuyer" : r.label === "Owner" ? "Property Owner" : r.label}
                  </button>
                ))}
              </div>
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
    </div>
  );
}
