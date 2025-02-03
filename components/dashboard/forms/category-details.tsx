// Prisma model
import { Category } from "@prisma/client";
import { FC } from "react";

interface CategoryDetailsProps {
  data?: Category;
}
const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  return <div>Category Details</div>;
};

export default CategoryDetails;
