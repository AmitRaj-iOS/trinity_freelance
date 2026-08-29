import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home as HomeIcon,
  Trees,
  Store,
  Warehouse,
  UploadCloud,
  X as XIcon,
} from "lucide-react";
import Button from "../common/Button";
import { STATUS } from "../../data/properties";
import { useFilterData } from "../../context/FilterDataContext";

const STEPS = ["Purpose & Type", "Location", "Property Details", "Amenities", "Photos", "Review"];

const PROPERTY_TYPE_ICONS = {
  Apartment: Building2,
  Villa: HomeIcon,
  Plot: Trees,
  Commercial: Store,
  Warehouse: Warehouse,
};

const AMENITY_OPTIONS = [
  "Clubhouse",
  "Swimming Pool",
  "Gym",
  "Kids Play Area",
  "24x7 Security",
  "Power Backup",
  "Covered Parking",
  "Lift",
  "Jogging Track",
  "Rainwater Harvesting",
  "Gated Community",
  "CCTV Surveillance",
];

const APPROVAL_OPTIONS = ["RERA", "CMDA", "DTCP"];

export const emptyDraft = {
  purpose: "Sell",
  propertyType: "",
  title: "",
  builder: "",
  state: "Tamil Nadu",
  city: "Chennai",
  locality: "",
  address: "",
  bhk: "",
  areaSqft: "",
  price: "",
  possessionStatus: STATUS.READY_TO_MOVE,
  possessionDate: "",
  approvals: [],
  amenities: [],
  description: "",
  images: [],
};

export function propertyToDraft(property) {
  return {
    purpose: property.purpose || "Sell",
    propertyType: property.type || "",
    title: property.name || "",
    builder: property.builder || "",
    state: property.state || "Tamil Nadu",
    city: property.city || "Chennai",
    locality: property.locality || property.location?.split(",")[0]?.trim() || "",
    address: property.address || "",
    bhk: property.bhk?.[0] ? String(property.bhk[0]) : "",
    areaSqft: property.areaSqft ? String(property.areaSqft) : "",
    price: property.priceFrom ? String(property.priceFrom) : "",
    possessionStatus: property.status || STATUS.READY_TO_MOVE,
    possessionDate: property.status !== STATUS.READY_TO_MOVE ? property.possession : "",
    approvals: property.approvals || [],
    amenities: property.amenities || [],
    description: property.description || "",
    images: property.gallery?.length ? property.gallery : property.image ? [property.image] : [],
  };
}

export default function PropertyFormWizard({
  draft,
  setDraft,
  onSubmit,
  submitLabel = "Save Changes",
  posterLabel,
  heading,
  subheading,
}) {
  const [step, setStep] = useState(0);
  const { states, citiesByState, localities, propertyTypes, bhkOptions } = useFilterData();

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const toggleFromList = (field, value) => {
    setDraft((d) => {
      const list = d[field].includes(value) ? d[field].filter((v) => v !== value) : [...d[field], value];
      return { ...d, [field]: list };
    });
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    update({ images: [...draft.images, ...urls] });
  };

  const removeImage = (idx) => {
    update({ images: draft.images.filter((_, i) => i !== idx) });
  };

  const canProceed = () => {
    if (step === 0) return Boolean(draft.propertyType);
    if (step === 1) return Boolean(draft.city && draft.locality.trim());
    if (step === 2) return Boolean(draft.title.trim() && draft.price && draft.areaSqft);
    return true;
  };

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <h1 className="text-2xl font-extrabold text-navy-900">{heading}</h1>
          <p className="mt-1 text-sm text-slate-500">{subheading}</p>

          <div className="mt-6 flex items-center gap-2 overflow-x-auto">
            {STEPS.map((label, idx) => (
              <div key={label} className="flex shrink-0 items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    idx < step
                      ? "bg-mint-600 text-white"
                      : idx === step
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {idx < step ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${idx === step ? "text-navy-900" : "text-slate-400"}`}>
                  {label}
                </span>
                {idx < STEPS.length - 1 && <div className="h-px w-6 bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 card-shadow sm:p-8">
          {step === 0 && (
            <div>
              <p className="text-sm font-bold text-navy-900">I want to</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Sell", "Rent", "Lease"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update({ purpose: p })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      draft.purpose === p
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-sm font-bold text-navy-900">Property Type</p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {propertyTypes.map((t) => {
                  const Icon = PROPERTY_TYPE_ICONS[t.key] || Building2;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => update({ propertyType: t.key })}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        draft.propertyType === t.key
                          ? "border-brand-600 bg-brand-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          draft.propertyType === t.key
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-navy-900">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">State</span>
                <select
                  value={draft.state}
                  onChange={(e) =>
                    update({ state: e.target.value, city: citiesByState[e.target.value]?.[0] || "" })
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">City</span>
                <select
                  value={draft.city}
                  onChange={(e) => update({ city: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {(citiesByState[draft.state] || []).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-navy-800">Locality / Area</span>
                <input
                  value={draft.locality}
                  onChange={(e) => update({ locality: e.target.value })}
                  type="text"
                  list="locality-options"
                  placeholder="e.g. OMR IT Corridor"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <datalist id="locality-options">
                  {localities.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-navy-800">Full Address (optional)</span>
                <textarea
                  value={draft.address}
                  onChange={(e) => update({ address: e.target.value })}
                  rows={3}
                  placeholder="Door no., street, landmark"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-navy-800">Listing Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                  type="text"
                  placeholder="e.g. Spacious 3BHK Villa in OMR"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">BHK / Configuration</span>
                <select
                  value={draft.bhk}
                  onChange={(e) => update({ bhk: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="">Not applicable</option>
                  {bhkOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} BHK
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Built-up Area (sq.ft)</span>
                <input
                  value={draft.areaSqft}
                  onChange={(e) => update({ areaSqft: e.target.value.replace(/\D/g, "") })}
                  type="text"
                  inputMode="numeric"
                  placeholder="1450"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Expected Price (₹)</span>
                <input
                  value={draft.price}
                  onChange={(e) => update({ price: e.target.value.replace(/\D/g, "") })}
                  type="text"
                  inputMode="numeric"
                  placeholder="7500000"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Possession Status</span>
                <select
                  value={draft.possessionStatus}
                  onChange={(e) => update({ possessionStatus: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {Object.values(STATUS).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {draft.possessionStatus !== STATUS.READY_TO_MOVE && (
                <label className="block text-sm">
                  <span className="font-semibold text-navy-800">Expected Possession (e.g. Dec 2026)</span>
                  <input
                    value={draft.possessionDate}
                    onChange={(e) => update({ possessionDate: e.target.value })}
                    type="text"
                    placeholder="Dec 2026"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </label>
              )}
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Builder / Developer (optional)</span>
                <input
                  value={draft.builder}
                  onChange={(e) => update({ builder: e.target.value })}
                  type="text"
                  placeholder="Leave blank for self-listed"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>

              <div className="sm:col-span-2">
                <span className="text-sm font-semibold text-navy-800">Approvals</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {APPROVAL_OPTIONS.map((a) => (
                    <label
                      key={a}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-700"
                    >
                      <input
                        type="checkbox"
                        checked={draft.approvals.includes(a)}
                        onChange={() => toggleFromList("approvals", a)}
                        className="h-3.5 w-3.5 accent-brand-600"
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-navy-800">Description (optional)</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  placeholder="Tell buyers what makes this property special"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-bold text-navy-900">Select Amenities</p>
              <p className="mt-1 text-xs text-slate-500">Choose all that apply to your property.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => {
                  const active = draft.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleFromList("amenities", a)}
                      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        active
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {active && <Check className="mr-1 inline h-3 w-3" />}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm font-bold text-navy-900">Upload Photos</p>
              <p className="mt-1 text-xs text-slate-500">
                Add a few photos so buyers can picture the property. (Stored locally for this demo.)
              </p>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-10 text-center hover:border-brand-400">
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <span className="text-sm font-semibold text-navy-800">Click to upload images</span>
                <span className="text-xs text-slate-400">PNG or JPG</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>

              {draft.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {draft.images.map((img, idx) => (
                    <div key={img} className="group relative aspect-square overflow-hidden rounded-lg">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-950/70 text-white"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <p className="text-sm font-bold text-navy-900">Review Your Listing</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReviewItem label="Purpose" value={draft.purpose} />
                <ReviewItem label="Type" value={draft.propertyType} />
                <ReviewItem label="Title" value={draft.title || "—"} />
                <ReviewItem
                  label="Location"
                  value={[draft.locality, draft.city, draft.state].filter(Boolean).join(", ")}
                />
                <ReviewItem label="Configuration" value={draft.bhk ? `${draft.bhk} BHK` : "—"} />
                <ReviewItem label="Area" value={draft.areaSqft ? `${draft.areaSqft} sq.ft` : "—"} />
                <ReviewItem
                  label="Price"
                  value={draft.price ? `₹${Number(draft.price).toLocaleString("en-IN")}` : "—"}
                />
                <ReviewItem label="Possession" value={draft.possessionStatus} />
                <ReviewItem label="Approvals" value={draft.approvals.join(", ") || "None"} />
                <ReviewItem label="Amenities" value={draft.amenities.join(", ") || "None"} />
                <ReviewItem label="Photos" value={`${draft.images.length} uploaded`} />
                <ReviewItem label="Posted By" value={posterLabel || "—"} />
              </div>
              {draft.description && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-600">{draft.description}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={step === 0 ? "invisible" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                disabled={!canProceed()}
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={onSubmit}>
                {submitLabel}
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-navy-900">{value}</p>
    </div>
  );
}
