import mongoose  from "mongoose";

export const db = ()=>{
    try {
        const connectionIntance =  mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Mongo connected !!");
    } catch (error) {
        console.log("Error occured during mongo connection " , error);
    }
}