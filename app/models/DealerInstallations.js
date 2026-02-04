const mongoose=require("mongoose");

const dealerInstallationsSchema=new mongoose.Schema(

    {
        dealerShopName:{
            type:String,
            required:true
        },
        regionName:{
            type:String,
            required:true
        },
        zone:{
            type:String,
            required:true
        },
        installationDate:{
            type:Date,
            required:true
        }
    },
    {timestamps:true}
);

module.exports=mongoose.model("DealerInstallations",dealerInstallationsSchema,"t_dealerinstallations");
