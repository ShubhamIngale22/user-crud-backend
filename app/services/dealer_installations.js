const DealerInstallations=require("../models/DealerInstallations");

module.exports= {
    totalInstallations: () => {

    let q = DealerInstallations.aggregate([
            {
                $facet: {
                    last24Hours: [
                        {
                            $match: {
                                installationDate: {
                                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                                }
                            }
                        },
                        {$count: "count"}
                    ],
                    last1Month: [
                        {
                            $match: {
                                installationDate: {
                                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                                }
                            }
                        },
                        {$count: "count"}
                    ],
                    last1Year: [
                        {
                            $match: {
                                installationDate: {
                                    $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                                }
                            }
                        },
                        {$count: "count"}
                    ]
                }
            }
        ]);
        return q.then(result => {
            const r = result[0] || {};
            return {
                last24Hours: r.last24Hours?.[0]?.count || 0,
                last1Month: r.last1Month?.[0]?.count || 0,
                last1Year: r.last1Year?.[0]?.count || 0
            };
        });
    },

    zoneInstallations:()=>{
    }


}


