import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import PropertyFormWizard, { propertyToDraft } from "../../components/property/PropertyFormWizard";
import { ADMIN_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminEditProperty() {
  const { admin, logoutAdmin } = useAdminAuth();
  const { getPropertyById, updateProperty } = useProperties();
  const navigate = useNavigate();
  const { id } = useParams();
  const property = getPropertyById(id);

  const [draft, setDraft] = useState(() => (property ? propertyToDraft(property) : null));

  const layoutProps = {
    role: "admin",
    roleLabel: "Admin",
    userName: admin.name,
    navItems: ADMIN_NAV,
    onLogout: () => {
      logoutAdmin();
      navigate("/admin/login");
    },
  };

  if (!property || !draft) {
    return (
      <DashboardLayout {...layoutProps}>
        <div className="mx-auto max-w-md py-24 text-center">
          <h1 className="text-xl font-bold text-navy-900">Property not found</h1>
          <p className="mt-2 text-sm text-slate-500">This listing may have been removed.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/admin/properties")}>
            Back to Properties
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = () => {
    updateProperty(id, draft, { name: admin.name, roleLabel: "Admin" });
    navigate("/admin/properties");
  };

  return (
    <DashboardLayout {...layoutProps}>
      <Link
        to="/admin/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </Link>

      <div className="-mx-4 lg:-mx-8">
        <PropertyFormWizard
          draft={draft}
          setDraft={setDraft}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          posterLabel={`${admin.name} (Admin)`}
          heading="Edit Listing"
          subheading={`Editing "${property.name}" as Master Admin.`}
        />
      </div>
    </DashboardLayout>
  );
}
