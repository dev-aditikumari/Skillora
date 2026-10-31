const cloudinary = require("cloudinary").v2;

const ALLOWED_TYPES = /^(image\/(png|jpe?g|webp|gif)|video\/(mp4|webm|quicktime))$/;

exports.uploadToCloudinary = async (file , folder , height , quality) =>{
    if (!file || !ALLOWED_TYPES.test(file.mimetype || "")) {
        const error = new Error("Unsupported file type");
        error.status = 400;
        throw error;
    }
    const options = {folder};
   if(height) {
    options.height = height;
   }
      if (quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

  const result = await cloudinary.uploader.upload(file.tempFilePath , options);
  return result;
}
