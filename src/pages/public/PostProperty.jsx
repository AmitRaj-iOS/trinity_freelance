import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import Button from "../../components/common/Button";
import AuthPortalModal from "../../components/auth/AuthPortalModal";
import PropertyFormWizard, { emptyDraft, propertyToDraft } from "../../components/property/PropertyFormWizard";
import { useAuth } from "../../context/AuthContext";
import { useProperties } from "../../context/PropertyContext";

export default function PostProperty() {
  const { user } = useAuth();
  const { addProperty, updateProperty, getPropertyById } = useProperties();
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const editingProperty = editId ? getPropertyById(editId) : null;
  const isEditMode = Boolean(editId);

  const [authOpen, setAuthOpen] = useState(!user);
  const [draft, setDraft] = useState(() => (editingProperty ? propertyToDraft(editingProperty) : emptyDraft));
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    setAuthOpen(!user);
  }, [user]);

  const handleSubmit = () => {
    if (isEditMode) {
      updateProperty(editId, draft, user);
      setSubmitted({ id: editId, name: draft.title, city: draft.city });
    } else {
      const property = addProperty(draft, user);
      setSubmitted(property);
    }
  };

  if (isEditMode && !editingProperty) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-xl font-bold text-navy-900">Property not found</h1>
          <p className="mt-2 text-sm text-slate-500">This listing may have been removed.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/owner/properties")}>
            Back to My Properties
          </Button>
        </div>
      </PublicLayout>
    );
  }

  if (submitted) {
    return (
      <PublicLayout>
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-50 text-mint-600">
            <PartyPopper className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-navy-900">
            {isEditMode ? "Property Updated Successfully!" : "Property Listed Successfully!"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-navy-800">{submitted.name}</span>{" "}
            {isEditMode ? "has been updated." : "is now live on Trin.ta."} Buyers can find it under{" "}
            {submitted.city} listings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={() => navigate(`/property/${submitted.id}`)}>
              View Live Listing
            </Button>
            <Button variant="outline" onClick={() => navigate("/owner/properties")}>
              Go to My Properties
            </Button>
            {!isEditMode && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDraft(emptyDraft);
                  setSubmitted(null);
                }}
              >
                Post Another Property
              </Button>
            )}
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <AuthPortalModal
        open={authOpen}
        onClose={() => navigate("/")}
        onSuccess={() => setAuthOpen(false)}
        initialRole="owner"
        roles={["owner", "builder", "agent"]}
      />

      <PropertyFormWizard
        draft={draft}
        setDraft={setDraft}
        onSubmit={handleSubmit}
        submitLabel={isEditMode ? "Save Changes" : "Post Property"}
        posterLabel={user ? `${user.name} (${user.roleLabel})` : "—"}
        heading={isEditMode ? "Edit Your Property Listing" : "Post Your Property — Free"}
        subheading={
          isEditMode
            ? "Update the details below and save your changes."
            : "Fill in the details below. It takes less than 3 minutes."
        }
      />
    </PublicLayout>
  );
}
