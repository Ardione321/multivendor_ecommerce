import {db} from "@/lib/db";
import StoreDetails from "@/components/dashboard/forms/store-details";
import {redirect} from "next/navigation";

const SellerStoreSettingsPage = async ({params}: { params: Promise<{ storeUrl: string }> }) => {
    const {storeUrl} = await params;
    const storeDetails = await db.store.findUnique({
        where: {
            url: storeUrl
        }
    })
    if (!storeDetails) redirect("/dashboard/seller/stores")
    return <div><StoreDetails data={storeDetails}/></div>;
};

export default SellerStoreSettingsPage;
