import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

const AdminSubCategoriesPage = async () => {
  // Fetching subCategories data from the database
  const subCategories = await getAllSubCategories();
  if (!subCategories) return null;

  // Fetching categories data from the database
  const categories = await getAllCategories();
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name..."
      columns={columns}
    />
  );
};

export default AdminSubCategoriesPage;
