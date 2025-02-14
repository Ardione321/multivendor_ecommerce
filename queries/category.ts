"use server";

// DB
import { db } from "@/lib/db";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Prisma
import { Category } from "@prisma/client";

// Function: upsertCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.

export const upsertCategory = async (category: Category) => {
  const { name, url, id } = category;
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

    // Ensure category data is provided
    if (!category) throw new Error("Please provide category data.");

    // Throw error if category with same name or URL already exists
    const existingCategory = await db.category.findFirst({
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

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === name) {
        errorMessage = "A category with the same name already exists";
      } else if (existingCategory.url === url) {
        errorMessage = "A category with the same url already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert category into the database
    const categoryDetails = await db.category.upsert({
      where: { id },
      update: category,
      create: category,
    });

    return categoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllCategories
// Description: Retrieves all categories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order.

export const getAllCategories = async () => {
  // Retrieve all categories from the database
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

// Function: getCategory
// Description: Retrieves a specific category from the database.
// Access Level: Public
// Parameters:
//   - categoryId: The ID of the category to be retrieved.
// Returns: Details of the requested category.

export const getCategory = async (categoryId: string) => {
  if (!categoryId) throw new Error("Please provide category ID.");
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  return category;
};

// Function: deleteCategory
// Description: Deletes a category from the database.
// Permission Level: Admin only
// Parameters:
//   - categoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.

export const deleteCategory = async (categoryId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("User is not authenticated");
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry");
  if (!categoryId) throw new Error("Please provide category ID.");

  const response = await db.category.delete({
    where: {
      id: categoryId,
    },
  });

  return response;
};
