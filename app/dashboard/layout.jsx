import { UserProvider } from "@/context/user-context";
import DashboardNavbar from "../components/dashboard-navbar";
import { RouteGuard } from "../components/route-guard";

export default function DashboardLayout({ children }) {
  console.log("DashboardLayout renderizado")
  return (
    <UserProvider>
      <RouteGuard>
        <div className="min-h-screen flex flex-col">
          <DashboardNavbar />
          <main className="flex-1">{children}</main>
        </div>
      </RouteGuard>
    </UserProvider>
  );
}
