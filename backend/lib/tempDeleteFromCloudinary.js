import cloudinary from "../config/cloudinary.config.js";


async function tempDeleteFromCloudinary(){
    try {
        const result = await cloudinary.api.resources({
            type: 'upload', // Specify to get uploaded resources
            resource_type: 'image', // Specify resource type (image, video, etc.)
            prefix:'temp_images/',
            max_results: 500, // Adjust as needed (max is 500)
            // Add other options here if needed, like `prefix` or `next_cursor`
        });
        result.resources.map((resource)=>cloudinary.uploader.destroy(resource.public_id))
    } catch (error) {
        console.log("error in cloudinary image deletion");
    }
}

export default tempDeleteFromCloudinary