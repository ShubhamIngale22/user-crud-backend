const DealerInstallations=require("../models/DealerInstallations");

const zoneDealerInstallationsQuery=(startDate,endDate)=>{
    return DealerInstallations.aggregate([
        {
            $match:{
                installationDate:{$gte:startDate , $lte:endDate}
            }
        },
        {
            $group:{
                _id:"$zone",
                count:{$sum:1}
            }
        },
        {
            $project:{
                _id:0,
                zone:"$_id",
                count:1
            }
        },
        {
            $sort:{
                count:-1
            }
        }
    ])
};

module.exports=zoneDealerInstallationsQuery;
