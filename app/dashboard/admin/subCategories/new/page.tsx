import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import { getAllCategories } from "@/queries/category";

const AdminNewSubCategoryPage = async () => {
  const categories = await getAllCategories();
  return <SubCategoryDetails categories={categories} />;
};

export default AdminNewSubCategoryPage;
