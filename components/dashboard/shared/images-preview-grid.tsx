import {FC} from "react";
import Image from "next/image";

// Import of the image shown when there are no images available
import NoImage from "@/public/assets/images/no_image_2.png"
import {cn} from "@/lib/utils";

interface ImagesPreviewGridProps {
    images: { url: string }[];
    onRemove: (value: string) => void;
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> =
    ({
         images,
         onRemove,
     }) => {
        // Calculate the number of images
        const imagesLength = images.length;

        // If there are no images, display a placeholder image
        if (imagesLength === 0) {
            return <div>
                <Image
                    src={NoImage}
                    alt="No images available"
                    width={500}
                    height={600}
                    className="rounded-md"
                />
            </div>
        } else {
            // If there are images, display the images in a grid
            return (
                <div className="max-w-4xl">
                    <div className={cn("grid grid-cols-2 h-[800px] overflow-hidden bg-white rounded-md")}>
                        {
                            images.map((image, index) => (
                                <div key={index}
                                     className={cn("relative group h-full w-full border border-gray-300")}>
                                    {/* Images */}
                                    <Image
                                        src={image.url}
                                        alt=""
                                        width={800}
                                        height={800}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        }

    }

export default ImagesPreviewGrid;