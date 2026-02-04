const dealerInstallationsQuery=require("../queries/DealerInstallation_query");
const zoneDealerInstallationsQuery=require("../queries/zone_dealer_installation_query")

module.exports= {
    totalDealerInstallations: () => {
        return dealerInstallationsQuery().then(result => {
            const r = result[0] || {};
            return {
                last24Hours: r.last24Hours?.[0]?.count || 0,
                last1Month: r.last1Month?.[0]?.count || 0,
                last1Year: r.last1Year?.[0]?.count || 0
            };
        });
    },

    ZoneDealerInstallations: (type="monthly") => {
        let startDate=new Date();

        if(type==="yearly"){
            startDate.setFullYear(startDate.getFullYear()-1);
        }else{
            startDate.setMonth(startDate.getMonth()-1);
        }
        
        return zoneDealerInstallationsQuery(startDate).then(result => {
            return result;
        });
    }
}


