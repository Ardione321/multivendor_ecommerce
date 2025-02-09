// React, Next js
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ReactNode } from "react";

const SellerStoreDashboardLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const user = await currentUser();

  if (!user) redirect("/");

  // Retrieved the list of stores associated with the authenticated user
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default SellerStoreDashboardLayout;
