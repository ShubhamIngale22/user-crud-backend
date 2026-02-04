const DealerInstallations=require("../models/DealerInstallations");

const dealerInstallationsQuery=()=>{
    return DealerInstallations.aggregate([
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
    ])
};

module.exports= dealerInstallationsQuery;
