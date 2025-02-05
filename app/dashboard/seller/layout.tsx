import {ReactNode} from "react";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const SellerDashboardLayout = async ({children}: { children: ReactNode })=> {
// Block non sellers from accessing the seller dashboard
    const user = await currentUser();

    if (user?.privateMetadata.role !== "SELLER") redirect("/")
    return <div>{children}</div>;

}

export default SellerDashboardLayout;