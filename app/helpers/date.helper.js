const moment=require('moment-timezone');

const TIMEZONE="Asia/Kolkata";

    module.exports={
        nowIST:()=>{
            return moment().tz(TIMEZONE);
        },

        formatIST:(date,format="DD-MM-YYYY hh:mm:ss A")=>{
            return moment(date).tz(TIMEZONE).format(format);
        },

        addMinutes:(minutes)=>{
            return moment().add(minutes,"minutes").toDate();
        },

        isExpired:(date)=>{
            return moment().isAfter(date);
        },

        toISTDate:(date)=>{
            return moment(date).tz(TIMEZONE).toDate();
        }

    };
