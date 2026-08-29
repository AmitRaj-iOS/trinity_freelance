import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, ArrowRight, ArrowLeft, Zap } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROLES, getRole } from "../../data/roles";

const LISTER_ROLES = ROLES.filter((r) => ["owner", "builder", "agent", "area_head"].includes(r.key));

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState("choose");
  const [roleKey, setRoleKey] = useState("buyer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (user) {
    const destination = location.state?.from?.pathname || getRole(user.role)?.dashboard || "/";
    return <Navigate to={destination} replace />;
  }

  const role = getRole(roleKey);

  const pickBuyer = () => {
    setRoleKey("buyer");
    setError("");
    setStep("form");
  };

  const pickListerRole = (key) => {
    setRoleKey(key);
    setError("");
    setStep("form");
  };

  const goBack = () => {
    setError("");
    if (step === "otp") setStep("form");
    else if (step === "form") setStep(roleKey === "buyer" ? "choose" : "pick-role");
    else if (step === "pick-role") setStep("choose");
  };

  const finishLogin = (finalName, finalPhone, finalRoleKey) => {
    login({ name: finalName, phone: finalPhone, roleKey: finalRoleKey });
    const destination = location.state?.from?.pathname || getRole(finalRoleKey)?.dashboard || "/";
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
    finishLogin(name, phone, roleKey);
  };

  const handleQuickLogin = () => finishLogin(role.demoName, role.demoPhone, roleKey);

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-navy-950 p-10 text-white lg:flex">
        <Link to="/" className="text-2xl font-extrabold">
          TRIN<span className="text-brand-500">.</span>TA
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">
            The no-broker way to buy, sell and rent property.
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            One login for buyers and renters searching for a home, another for owners, builders
            and agents listing and managing property.
          </p>
        </div>
        <p className="text-xs text-slate-500">© 2026 Trin.ta Properties</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 block text-2xl font-extrabold text-navy-900 lg:hidden">
            TRIN<span className="text-brand-600">.</span>TA
          </Link>

          {step === "choose" && (
            <>
              <h1 className="text-2xl font-extrabold text-navy-900">Welcome to Trin.ta</h1>
              <p className="mt-1 text-sm text-slate-500">
                Tell us why you're here and we'll take you to the right place.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={pickBuyer}
                  className="flex w-full items-center gap-4 rounded-2xl border-2 border-slate-200 p-4 text-left transition-colors hover:border-brand-400"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">I'm buying or renting</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Search listings, save favourites and contact owners directly.
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep("pick-role")}
                  className="flex w-full items-center gap-4 rounded-2xl border-2 border-slate-200 p-4 text-left transition-colors hover:border-brand-400"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">I'm listing a property</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Post listings and manage leads as an owner, builder or agent.
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                </button>
              </div>
            </>
          )}

          {step === "pick-role" && (
            <>
              <button
                type="button"
                onClick={goBack}
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <h1 className="text-2xl font-extrabold text-navy-900">How will you list?</h1>
              <p className="mt-1 text-sm text-slate-500">Choose the role that best fits you.</p>

              <div className="mt-6 space-y-2.5">
                {LISTER_ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => pickListerRole(r.key)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition-colors hover:border-brand-400"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <r.icon className={`h-4 w-4 ${r.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">{r.label}</p>
                      <p className="text-xs text-slate-500">{r.pitchDesc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "form" && (
            <>
              <button
                type="button"
                onClick={goBack}
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <h1 className="text-2xl font-extrabold text-navy-900">Sign in as {role.label}</h1>
              <p className="mt-1 text-sm text-slate-500">{role.pitchDesc}</p>

              <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                <label className="block text-sm">
                  <span className="font-semibold text-navy-800">Full Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="e.g. Karthik Venkat"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-navy-800">Mobile Number (OTP Verification)</span>
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

                {error && <p className="text-xs font-semibold text-brand-600">{error}</p>}

                <Button type="submit" size="lg" className="w-full">
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-slate-500">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Demo Access
                </p>
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="mt-3 w-full rounded-lg bg-navy-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-navy-800"
                >
                  Sign In as {role.demoName}
                </button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={goBack}
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change number
              </button>
              <h1 className="text-2xl font-extrabold text-navy-900">Verify your number</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter the OTP sent to <span className="font-bold text-navy-900">+91 {phone}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  placeholder="0000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-center text-2xl font-extrabold tracking-[0.5em] text-navy-900 focus:border-brand-500 focus:outline-none"
                />
                <p className="text-center text-xs text-slate-400">Demo mode — enter any 4 digits to continue.</p>

                {error && <p className="text-center text-xs font-semibold text-brand-600">{error}</p>}

                <Button type="submit" size="lg" className="w-full">
                  Verify &amp; Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
