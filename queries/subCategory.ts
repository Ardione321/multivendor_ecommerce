"use server";

// DB
import { db } from "@/lib/db";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Prisma
import { SubCategory } from "@prisma/client";

// Function: upsertSubCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - SubCategory: SubCategory object containing details of the SubCategory to be upserted.
// Returns: Updated or newly created SubCategory details.

export const upsertSubCategory = async (subCategory: SubCategory) => {
  const { name, url, id } = subCategory;
  try {
    // Get Current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("User is not authenticated");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry"
      );

    // Ensure subCategory data is provided
    if (!subCategory) throw new Error("Please provide subCategory data.");

    // Throw error if subCategory with same name or URL already exists
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name }, { url }],
          },
          {
            NOT: { id },
          },
        ],
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === name) {
        errorMessage = "A subCategory with the same name already exists";
      } else if (existingSubCategory.url === url) {
        errorMessage = "A subCategory with the same url already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert subCategory into the database
    const subCategoryDetails = await db.subCategory.upsert({
      where: { id },
      update: subCategory,
      create: subCategory,
    });

    return subCategoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllSubCategories
// Description: Retrieves all subCategories from the database.
// Permission Level: Public
// Returns: Array of subCategories sorted by updatedAt date in descending order.

export const getAllSubCategories = async () => {
  // Retrieve all subCategories from the database
  const subCategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

// Function: getSubCategory
// Description: Retrieves a specific SubCategory from the database.
// Access Level: Public
// Parameters:
//   - SubCategoryId: The ID of the SubCategory to be retrieved.
// Returns: Details of the requested SubCategory.

export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) throw new Error("Please provide subCategoryId ID.");
  const subCategory = await db.subCategory.findUnique({
    where: {
      id: subCategoryId,
    },
  });
  return subCategory;
};

// Function: deleteSubCategory
// Description: Deletes a subCategory from the database.
// Permission Level: Admin only
// Parameters:
//   - categoryId: The ID of the subCategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.

export const deleteSubCategory = async (subCategoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("User is not authenticated");
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry");
  if (!subCategoryId) throw new Error("Please provide subCategory ID.");

  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });

  return response;
};
