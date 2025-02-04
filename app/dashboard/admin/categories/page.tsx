// Queries
import { getAllCategories } from "@/queries/category";

// Datatable
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/category-details";

const AdminCategoriesPage = async () => {
  // Fetching stores data from the database
  const categories = await getAllCategories();

  // Checking if no categories are found
  if (!categories) return null;

  const CLOUDINARY_CLOUD_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  if (!CLOUDINARY_CLOUD_KEY) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails cloudinary_key={CLOUDINARY_CLOUD_KEY} />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={[]}
    />
  );
};

export default AdminCategoriesPage;
