import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {currentUser} from "@clerk/nextjs/server";


const SellerDashboardPage = async () => {
// Fetch the current user. if the user is not authenticated, redirect them to the home page
    const user = await currentUser();

    if (!user) redirect("/");

    // Retrieve the list of stores associated with the authenticated user
    const stores = await db.store.findMany({
        where: {
            userId: user.id
        },
    });

    // If the user has no stores, redirect them to the page for create a new store.
    if (stores.length === 0) redirect("/dashboard/seller/stores/new");

    // If the user has a stores, redirect them to the dashboard of their first store
    redirect(`/dashboard/seller/stores/${stores[0].url}`);
    return <div>Seller Dashboard Page</div>;
};

export default SellerDashboardPage;
