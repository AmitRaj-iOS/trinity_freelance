import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { MapPin, CheckCircle2, Heart, Share2, Phone, Calendar, Lock, Zap } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { useProperties } from "../../context/PropertyContext";
import { useAuth } from "../../context/AuthContext";
import { useContactReveal, FREE_REVEAL_LIMIT } from "../../context/ContactRevealContext";
import { agents, owners } from "../../data/agentData";

export default function PropertyDetail() {
  const { id } = useParams();
  const { getPropertyById, recordVisit } = useProperties();
  const { user } = useAuth();
  const { isRevealed, remainingFor, reveal } = useContactReveal();
  const navigate = useNavigate();
  const location = useLocation();
  const property = getPropertyById(id);
  const [activeImage, setActiveImage] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const recordedFor = useRef(null);

  useEffect(() => {
    if (property && recordedFor.current !== property.id) {
      recordedFor.current = property.id;
      recordVisit(property.id, user);
    }
  }, [property?.id, recordVisit, user]);

  if (!property) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-xl font-bold text-navy-900">Property not found</h1>
          <Link to="/buy" className="mt-3 inline-block text-brand-600 hover:underline">
            Back to listings
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const agent = agents[property.agentId];
  const owner =
    owners[property.ownerId] ||
    (property.postedBy && { name: property.postedBy.name, phone: property.postedBy.phone });
  const contact = agent || owner;
  const contactPhone = contact?.phone;
  const revealed = user ? isRevealed(user.id, property.id) : false;
  const remaining = user ? remainingFor(user.id) : FREE_REVEAL_LIMIT;

  const handleRevealContact = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    const ok = reveal(user.id, property.id);
    if (!ok) setLimitReached(true);
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <nav className="mb-4 text-xs text-slate-400">
          <Link to="/" className="hover:text-brand-600">
            Home
          </Link>{" "}
          / <Link to="/buy" className="hover:text-brand-600">Buy</Link> / {property.name}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="overflow-hidden rounded-2xl">
              <img
                src={property.gallery[activeImage]}
                alt={property.name}
                className="h-72 w-full object-cover sm:h-[420px]"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {property.gallery.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                    idx === activeImage ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={property.status} />
                  {property.approvals.map((a) => (
                    <Badge key={a} variant="outline">
                      {a}
                    </Badge>
                  ))}
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl">
                  {property.name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  {property.location}
                </p>
                <p className="mt-1 text-sm text-slate-500">By {property.builder}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy-700 hover:bg-slate-50">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy-700 hover:bg-slate-50">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {property.status === "Under Construction" && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-navy-900">Construction Progress</span>
                  <span className="font-bold text-brand-600">{property.completion}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${property.completion}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 card-shadow sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-400">Configuration</p>
                <p className="text-sm font-bold text-navy-900">{property.config}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Possession</p>
                <p className="text-sm font-bold text-navy-900">{property.possession}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Property Type</p>
                <p className="text-sm font-bold text-navy-900">{property.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Starting From</p>
                <p className="text-sm font-bold text-navy-900">{property.priceLabel}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
              <h2 className="text-lg font-bold text-navy-900">About This Property</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {property.tagline}. Thoughtfully planned by {property.builder}, this development
                offers a considered mix of design, connectivity and lifestyle amenities suited to
                modern living in {property.city}.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
              <h2 className="text-lg font-bold text-navy-900">Amenities</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-mint-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
              <p className="text-xs text-slate-400">Starting From</p>
              <p className="text-2xl font-extrabold text-navy-900">{property.priceLabel}</p>

              {inquirySent ? (
                <div className="mt-4 rounded-lg bg-mint-50 p-3 text-sm font-semibold text-mint-600">
                  Inquiry sent! The owner/agent will contact you shortly.
                </div>
              ) : (
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInquirySent(true);
                  }}
                >
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    <Phone className="h-4 w-4" />
                    Contact Owner / Agent
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="w-full">
                    <Calendar className="h-4 w-4" />
                    Schedule a Site Visit
                  </Button>
                </form>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Listed By
              </p>
              {agent ? (
                <>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-sm font-bold text-navy-700">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">{agent.name}</p>
                      <p className="text-xs text-slate-400">Verified Agent</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Property Owner</p>
                  <p className="text-sm font-semibold text-navy-800">{owner?.name || "—"}</p>
                </>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-sm font-bold text-navy-700">
                    {(owner?.name || "OW")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{owner?.name || "Property Owner"}</p>
                    <p className="text-xs text-slate-400">Self-Listed Owner</p>
                  </div>
                </div>
              )}

              {contactPhone && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {revealed ? (
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 rounded-lg bg-mint-50 px-3 py-2.5 text-sm font-bold text-mint-700 hover:bg-mint-100"
                    >
                      <Phone className="h-4 w-4" />
                      {contactPhone}
                    </a>
                  ) : limitReached ? (
                    <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-navy-800">
                      <p className="flex items-center gap-1.5 font-bold text-amber-700">
                        <Zap className="h-3.5 w-3.5" />
                        Free reveals used up
                      </p>
                      <p className="mt-1 text-slate-600">
                        You've viewed {FREE_REVEAL_LIMIT} owner contacts for free. Unlock unlimited
                        reveals to see this number.
                      </p>
                      <Link
                        to="/unlimited-pass"
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white hover:bg-navy-800"
                      >
                        Unlock Unlimited Pass
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRevealContact}
                      className="flex w-full items-center justify-between rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-left hover:border-brand-400"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-navy-800">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                        •••• •••• ••
                      </span>
                      <span className="text-xs font-semibold text-brand-600">Reveal Number</span>
                    </button>
                  )}
                  {!revealed && !limitReached && (
                    <p className="mt-2 text-center text-[11px] text-slate-400">
                      {user
                        ? `${remaining} of ${FREE_REVEAL_LIMIT} free contact reveals left`
                        : `Sign in to reveal up to ${FREE_REVEAL_LIMIT} owner contacts for free`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
