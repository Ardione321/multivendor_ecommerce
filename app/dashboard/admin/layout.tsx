import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Header
import Header from "@/components/dashboard/header/header";

// Sidebar
import Sidebar from "@/components/dashboard/sidebar/sidebar";

const AdminDashboardLayout = async ({ children }: { children: ReactNode }) => {
  // Block non admins from accessing the admin dashboard
  const user = await currentUser();

  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");

  return (
    <div className="w-full h-full">
      {/* sidebar */}
      <Sidebar isAdmin />
      <div className="w-full ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
