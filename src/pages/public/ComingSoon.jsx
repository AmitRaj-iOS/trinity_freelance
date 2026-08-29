import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import Button from "../../components/common/Button";

export default function ComingSoon() {
  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Construction className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-navy-900">Coming in a later phase</h1>
        <p className="mt-2 text-sm text-slate-500">
          This screen is scoped but not yet built in Phase 1. Check the Phase 1 document for what's live today.
        </p>
        <Button as={Link} to="/" variant="primary" className="mt-6">
          Back to Home
        </Button>
      </div>
    </PublicLayout>
  );
}
