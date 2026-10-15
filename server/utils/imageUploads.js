const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (file , folder , height , quality) =>{
    const options = {folder};
    // TODO 1: if height was passed, add it to options (options.height = ...)
   if(height) {
    options.height = height;
   }
  // TODO 2: if quality was passed, add it to options
      if (quality){
        options.quality = quality;
    }
  // TODO 3: set options.resource_type = "auto"
  //         (so the SAME function works for images AND videos)
    options.resource_type = "auto";

  // TODO 4: upload the file and return the result
  //         cloudinary.uploader.upload(<which property of file?>, options)
  //         Hint: you set useTempFiles: true in index.js. What path does that give you?
  const result = await cloudinary.uploader.upload(file.tempFilePath , options);
  return result;
}
