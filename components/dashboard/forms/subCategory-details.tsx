"use client";

// React
import {FC, useEffect} from "react";

// Prisma model
import {Category, SubCategory} from "@prisma/client";

// Form handling utilities
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// Schema
import {SubCategoryFormSchema} from "@/lib/schemas";
import {AlertDialog} from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";

// Queries
import {upsertSubCategory} from "@/queries/subCategory";

// Utils
import {v4} from "uuid";

// hooks and navigation
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {SelectValue} from "@radix-ui/react-select";
import {handleError} from "@/lib/utils";

interface CategoryDetailsProps {
    data?: SubCategory;
    categories: Category[];
}

const SubCategoryDetails: FC<CategoryDetailsProps> = ({data, categories}) => {
    const {toast} = useToast();
    const router = useRouter();

    // Form hook for managing form state and validation
    const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
        mode: "onChange", // Form validation mode
        resolver: zodResolver(SubCategoryFormSchema), // Resolver for form validation
        defaultValues: {
            name: data?.name || "", // Ensures it's always a string
            image: data?.image ? [{url: data?.image}] : [],
            url: data?.url || "", // Ensures it's always a string
            featured: data?.featured ?? false, // Ensures it's always a boolean
            categoryId: data?.categoryId,
        },
    });

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    const formData = form.watch();
    console.log(formData);

    // Reset form values when data changes
    useEffect(() => {
        console.log("Data updated:", data);
        if (data) {
            form.reset({
                name: data.name || "",
                image: data.image ? [{url: data.image}] : [],
                url: data.url || "",
                featured: data.featured ?? false,
                categoryId: data.categoryId ?? "",
            });
        }
    }, [data, form]);

    // Submit handler for form submission
    const handleSubmit = async (
        values: z.infer<typeof SubCategoryFormSchema>
    ) => {
        try {
            // Upsert the category data
            const response = await upsertSubCategory({
                id: data?.id ? data.id : v4(),
                name: values.name,
                image: values.image[0].url,
                url: values.url,
                featured: values.featured,
                categoryId: values.categoryId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            //displaying success message
            toast({
                title: data?.id
                    ? "Category has been updated"
                    : `Congratulations ${response.name} is now created`,
            });

            // Redirect or Refresh data
            if (data?.id) {
                router.refresh();
            } else {
                router.push("/dashboard/admin/subCategories");
            }
        } catch (error) {
            const errorMessage = handleError(error)
            toast({
                variant: "destructive",
                title: "!Oops",
                description: errorMessage,
            });
        }
    };
    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>SubCategory Information</CardTitle>
                    <CardDescription>
                        {data?.id
                            ? `Update ${data?.name} SubCategory information`
                            : "Lets create a SubCategory. You can edit SubCategory settings later from the SubCategories table or SubCategory page."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="image"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUpload
                                                type="profile"
                                                value={field.value.map((image) => image.url)}
                                                disabled={isLoading}
                                                onChange={(url) => field.onChange([{url}])}
                                                onRemove={(url) =>
                                                    field.onChange([
                                                        ...field.value.filter(
                                                            (current) => current.url !== url
                                                        ),
                                                    ])
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>SubCategory name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="url"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>SubCategory url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/subCategory-url" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="categoryId"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            disabled={isLoading || categories.length === 0}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                // @ts-ignore
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Featured</FormLabel>
                                            <FormDescription>
                                                This SubCategory will appear on the home page
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Loading..."
                                    : data?.id
                                        ? "Save Sub-Category information"
                                        : "Create Sub-Category"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AlertDialog>
    );
};

export default SubCategoryDetails;
