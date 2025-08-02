import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";
dotenv.config("../.env");

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME , 
    api_key:process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET , // Click 'View API Keys' above to copy your API secret
});


// making and uploader function 

const uploadOnCloudinary = async (localPath) => {
    try{
        const result = await cloudinary.uploader.upload(localPath , {
            resource_type:"auto",
        })

        console.log("file has been uploaded succesfully " , result.secure_url);
    
        fs.unlinkSync(localPath)
        return result ;
    }
    catch(err){
        fs.unlinkSync(localPath)
        console.log("error occured during file uploade in cludinary " , err)
    }
};

export default {uploadOnCloudinary};