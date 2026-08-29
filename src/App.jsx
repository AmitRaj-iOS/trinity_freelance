import { Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Listings from "./pages/public/Listings";
import PropertyDetail from "./pages/public/PropertyDetail";
import Login from "./pages/public/Login";
import PostProperty from "./pages/public/PostProperty";
import Wishlist from "./pages/public/Wishlist";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentListings from "./pages/agent/AgentListings";
import AgentLeads from "./pages/agent/AgentLeads";
import AgentSiteVisits from "./pages/agent/AgentSiteVisits";
import AgentCommission from "./pages/agent/AgentCommission";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerLeads from "./pages/owner/OwnerLeads";
import OwnerSiteVisits from "./pages/owner/OwnerSiteVisits";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminAddData from "./pages/admin/AdminAddData";
import AdminEditProperty from "./pages/admin/AdminEditProperty";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";
import ComingSoon from "./pages/public/ComingSoon";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buy" element={<Listings />} />
      <Route path="/rent" element={<Listings />} />
      <Route path="/new-projects" element={<Listings />} />
      <Route path="/lease" element={<Listings />} />
      <Route path="/commercial" element={<Listings />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/post-property" element={<PostProperty />} />
      <Route path="/post-property/edit/:id" element={<PostProperty />} />
      <Route path="/account/wishlist" element={<Wishlist />} />

      <Route path="/agent" element={<AgentDashboard />} />
      <Route path="/agent/listings" element={<AgentListings />} />
      <Route path="/agent/leads" element={<AgentLeads />} />
      <Route path="/agent/site-visits" element={<AgentSiteVisits />} />
      <Route path="/agent/commission" element={<AgentCommission />} />

      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="/owner/properties" element={<OwnerProperties />} />
      <Route path="/owner/leads" element={<OwnerLeads />} />
      <Route path="/owner/site-visits" element={<OwnerSiteVisits />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <AdminRoute>
            <AdminProperties />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties/edit/:id"
        element={
          <AdminRoute>
            <AdminEditProperty />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <AdminRoute>
            <AdminLeads />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-data"
        element={
          <AdminRoute>
            <AdminAddData />
          </AdminRoute>
        }
      />

      <Route path="*" element={<ComingSoon />} />
    </Routes>
  );
}
