import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "./adminStore";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}
