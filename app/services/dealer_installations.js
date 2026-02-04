const dealerInstallationsQuery=require("../queries/DealerInstallation_query");

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
    }
}


