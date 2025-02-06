"use client";

// React
import {FC, useEffect} from "react";

// Prisma model
import {Store} from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// Schema
import {StoreFormSchema} from "@/lib/schemas";

// UI Components
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";

// Queries
import {upsertCategory} from "@/queries/category";

// Utils
import {v4} from "uuid";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {handleError} from "@/lib/utils";

interface CategoryDetailsProps {
    data?: Store;
}

const StoreDetails: FC<CategoryDetailsProps> = ({data}) => {
    // Initializing necessary hooks
    const {toast} = useToast(); // Hook for displaying toast messages
    const router = useRouter(); // Hook for routing

    // Form hook for managing form state and validation
    const form = useForm<z.infer<typeof StoreFormSchema>>({
        mode: "onChange", // Form validation mode
        resolver: zodResolver(StoreFormSchema), // Resolver for form validation
        defaultValues: {
            // Setting default form values from data (if available)
            name: data?.name,
            description: data?.description,
            email: data?.email,
            phone: data?.phone,
            url: data?.url,
            logo: data?.logo ? [{url: data?.logo}] : [],
            cover: data?.cover ? [{url: data?.cover}] : [],
            status: data?.status.toString(),
            featured: data?.featured,
            // image: data?.image ? [{ url: data?.image }] : [],
        },
    });

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    // Reset form values when data changes
    useEffect(() => {
        if (data) {
            form.reset({
                ...data,
                logo: [{url: data?.logo}],
                cover: [{url: data?.cover}],
            });
        }
    }, [data, form]);

    // Submit handler for form submission
    const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
        try {
            // Upsert category data
            const response = await upsertCategory({
                id: data?.id ? data.id : v4(),
                name: values.name,
                image: values.image[0].url,
                url: values.url,
                featured: values.featured,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Displaying success message
            toast({
                title: data?.id
                    ? "Category has been updated."
                    : `Congratulations! '${response?.name}' is now created.`,
            });

            // Redirect or Refresh data
            if (data?.id) {
                router.refresh();
            } else {
                router.push("/dashboard/admin/categories");
            }
        } catch (error) {
            const errorMessage = handleError(error);
            toast({
                variant: "destructive",
                title: "Oops!",
                description: errorMessage,
            });
        }
    };

    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>
                        {data?.id
                            ? `Update ${data?.name} store information.`
                            : " Lets create a store. You can edit store later from the categories table or the store page."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <div className="relative py-2 mb-24 ">
                                <FormField
                                    control={form.control}
                                    name="logo"
                                    render={({field}) => (
                                        <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-56">
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
                                    control={form.control}
                                    name="cover"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    type="cover"
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
                            </div>

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Store name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Store Name" {...field} />
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
                                        <FormLabel>Store url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/store-url" {...field} />
                                        </FormControl>
                                        <FormMessage/>
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
                                                This Category will appear on the home page
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "loading..."
                                    : data?.id
                                        ? "Save store information"
                                        : "Create store"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AlertDialog>
    );
};

export default StoreDetails;
