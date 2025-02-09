import {getAllCategories} from "@/queries/category";

const SellerNewProductsPage = async ({params}: { params: { storeUrl: string } }) => {
    const categories = await getAllCategories();
    return <div className="w-full"></div>
}

export default SellerNewProductsPage;