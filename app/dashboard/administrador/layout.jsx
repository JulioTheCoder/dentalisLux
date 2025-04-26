import { UserProvider } from "@/context/user-context";
import DashboardNavbar from "@/app/components/dashboard-navbar";

export default function DashboardLayout({ children }) {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <DashboardNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </UserProvider>
  );
}