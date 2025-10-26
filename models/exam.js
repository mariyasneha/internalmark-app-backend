const mongoose=require("mongoose")
const examSchema=mongoose.Schema(
    {
        name:String,
        admno:String,
        subject:String,
        email:String,
        present:String,
        totaldays:String,
        inter1:String,
        inter1tot:String,
        inter2:String,
        inter2tot:String,
        assign1:String,
        assign2:String,
        internalmark:String
    }
)
const examModel=mongoose.model("internalmarks",examSchema)
module.exports=examModel