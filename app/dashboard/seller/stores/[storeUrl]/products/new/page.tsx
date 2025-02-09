import {getAllCategories} from "@/queries/category";
import ProductDetails from "@/components/dashboard/forms/product-detail";

const SellerNewProductsPage = async ({params}: { params: Promise<{ storeUrl: string }> }) => {
    const {storeUrl} = await params;
    const categories = await getAllCategories();
    return <div className="w-full"><ProductDetails categories={categories} storeUrl={storeUrl}/></div>
}

export default SellerNewProductsPage;