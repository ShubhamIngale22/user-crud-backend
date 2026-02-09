const DealerInstallations = require("../models/DealerInstallations");

const top5MakeModelQuery= ()=>{
    return DealerInstallations.aggregate([
        {
            $match: {
                manufacturerName: { $ne: null },
                vehicleModelNo: { $ne: null }
            }
        },
        {
            $group: {
                _id:{
                    make:"$manufacturerName",
                    model:"$vehicleModelNo"
                } ,
                count: { $sum: 1 }
            },
        },
        {
            $sort: {count:-1}
        },
        {
            $limit:5
        },
        {
            $project:{
                _id:0,
                make:"$_id.make",
                model:"$_id.model",
                count:1
            }
        }
    ])
}
module.exports= top5MakeModelQuery;
