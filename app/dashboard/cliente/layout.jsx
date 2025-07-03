import { UserProvider } from "@/context/user-context";


export default function DashboardLayout({ children }) {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </UserProvider>
  );
}