import mongoose from "mongoose"


const db_connect = () => {

    mongoose.connect(process.env.MONGO_URL, { dbName: "formBuilder" }).then((res) => {
        console.log("Database Connected.");
    }).catch((e) => {
        console.log("Database Error : ", e)
    })

};

export default db_connect;