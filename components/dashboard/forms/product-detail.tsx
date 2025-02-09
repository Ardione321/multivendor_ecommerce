"use client";

// React, Next.js
import {FC, useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

// Prisma model
// import {Store} from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// Schema
import {ProductFormSchema} from "@/lib/schemas";

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
import {Textarea} from "@/components/ui/textarea";

// Queries
import {upsertStore} from "@/queries/store";

// Utils
import {v4} from "uuid";
import {handleError} from "@/lib/utils";
import {ProductWithVariantType} from "@/lib/types";
import {Category} from "@prisma/client";
import ImagesPreviewGrid from "@/components/dashboard/shared/images-preview-grid";


interface StoreDetailsProps {
    data?: ProductWithVariantType;
    categories: Category[];
    storeUrl: string;
}

const ProductDetails: FC<StoreDetailsProps> = ({data, categories, storeUrl}) => {
    // Initializing necessary hooks
    const {toast} = useToast(); // Hook for displaying toast messages
    const router = useRouter(); // Hook for routing

    // Temporary state for images
    const [images, setImages] = useState<{url: string}[]>([]);

    // Form hook for managing form state and validation
    const form = useForm<z.infer<typeof ProductFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            name: data?.name ?? "", // Ensure this has a default value
            description: data?.description ?? "",
            variantName: data?.variantName ?? "",
            variantDescription: data?.variantDescription ?? "",
            images: data?.images || [],
            categoryId: data?.categoryId,
            subCategoryId: data?.subCategoryId,
            brand: data?.brand,
            sku: data?.sku,
            colors: data?.colors || [{color: ""}],
            sizes: data?.sizes,
            keywords: data?.keywords,
            isSale: data?.isSale,
        },
    });

    // Loading status based on form submission
    const isLoading = form.formState.isSubmitting;

    // Reset form values when data changes
    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    // Submit handler for form submission
    const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
        try {
            const response = await upsertStore({
                id: data?.id ? data.id : v4(),
                name: values.name,
                description: values.description,
                email: values.email,
                phone: values.phone,
                logo: values.logo[0].url,
                cover: values.cover[0].url,
                url: values.url,
                featured: values.featured,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            toast({
                title: data?.id
                    ? "Store has been updated."
                    : `Congratulations! '${response?.name}' is now created.`,
            });

            if (data?.id) {
                router.refresh();
            } else {
                router.push(`/dashboard/seller/stores/${response.url}`);
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
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>
                        {data?.productId && data.variantId
                            ? `Update ${data?.name} product information.`
                            : " Lets create a product. You can edit product later from the products page."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            {/* Images - Colors */}
                            <div className="flex flex-col gap-y-6 xl:flex-row">
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                               <div>
                                                   <ImagesPreviewGrid
                                                       images={form.getValues().images}
                                                       onRemove={(url) =>
                                                           field.onChange([
                                                               ...field.value.filter(
                                                                   (current) => current.url !== url
                                                               ),
                                                           ])
                                                       }
                                                   />
                                                   <FormMessage className="!mt-4"/>
                                                   <ImageUpload
                                                       dontShowPreview
                                                       type="standard"
                                                       value={field.value.map((image) => image.url)}
                                                       disabled={isLoading}
                                                       onChange={(url) => {
                                                           setImages((prevImages) => {
                                                               const updatedImages = [...prevImages, {url}];
                                                               field.onChange(updatedImages);
                                                               return updatedImages;
                                                           })
                                                       }}
                                                       onRemove={(url) =>
                                                           field.onChange([
                                                               ...field.value.filter(
                                                                   (current) => current.url !== url
                                                               ),
                                                           ])
                                                       }
                                                   />
                                               </div>
                                            </FormControl>
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
                                            <FormControl>
                                                <Input placeholder="Product name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            <div>
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="variantName"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Variant name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "loading..."
                                    : data?.productId && data.variantId
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

export default ProductDetails;
