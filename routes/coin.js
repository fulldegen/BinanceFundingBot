var express = require('express');
var router = express.Router();
var Binance = require('node-binance-api');

const telegramId = '1078421780:AAE8enuqKx6rrBogLgGI4ppCykT0VkgMa-0';
const Telegraf = require('telegraf')
const bot = new Telegraf(telegramId);

const request = require('request');


const binance = new Binance().options({APIKEY: 'h483dxsj6F0J0fbGOvnVGS3YMFmlqVNlxQwp11z4OKqqxDuQTVmaVWByTRp6w0EU', APISECRET: 'X2UJFXrjfvPlY9TSfvIYXRwLhZnQmNdesFeOwWI2l91kDvQTTA7fEWTF2ya6qgG4'});

bot.launch();

var cron = require('node-cron');

// function getGroupIDS() {
//     return new Promise((resolve,reject) => {
//         request(`https://api.telegram.org/bot${telegramId}/getUpdates`, function (error, response, body) {
//             console.log('body:', body); // Print the HTML for the Google homepage.
//             const groupIDs = [];
//             if(response && response.statusCode == 200) {
//                 if(body.result && body.result.length > 0) {
//                     body.result.forEach(each => {
//                         groupIDs.push(each.message.chat.id)
//                     })
//                     resolve(groupIDs);
//                 }
//             }
//         });
//     })
// };


cron.schedule('* * * * *', async (ctx) => {
    console.log('running a task every minute');
    try {
        var result = await get_BTC();

        var message = "BTC\n" +
        "Funding Rate: " + Number(result.btcFundingRate*100).toFixed(4) + "% \n" + 
        "Spot Price: " + Number(result.btcSportPrice).toFixed(2) + " \n" + 
        "Future Price: " + Number(result.btcFuturePrice).toFixed(2) + " \n" + 
        "ETH\n" +
        "Funding Rate: " +  Number(result.ethFundingRate*100).toFixed(4)+ "% \n" + 
        "Spot Price: " +  Number(result.ethSportPrice).toFixed(2) + " \n" + 
        "Future Price: " +  Number(result.ethFuturePrice).toFixed(2) + " \n";
    
        //  console.log('message', message)
    
        //  const groupIDs = await getGroupIDS(); console.log('groupIDs', groupIDs);
        //  groupIDs.forEach(each => {
        //     bot.telegram.sendMessage(each, message);
        //  })
    
        //  bot.telegram.sendMessage('-407621766', message);
        //  bot.telegram.sendMessage('-341302787', message);
        //  bot.telegram.sendMessage('-355470478', message);
         bot.telegram.sendMessage('-1001192042062', message);
    } catch(errror) {
        console.log(error)
    }
    
});


bot.hears('/coinrate', async (ctx) => {
    var result = await get_BTC();

    var message = "BTC\n" +
    "Funding Rate: " + Number(result.btcFundingRate*100).toFixed(4) + "% \n" + 
    "Spot Price: " + Number(result.btcSportPrice).toFixed(2) + " \n" + 
    "Future Price: " + Number(result.btcFuturePrice).toFixed(2) + " \n" + 
    "ETH\n" +
    "Funding Rate: " +  Number(result.ethFundingRate*100).toFixed(4)+ "% \n" + 
    "Spot Price: " +  Number(result.ethSportPrice).toFixed(2) + " \n" + 
    "Future Price: " +  Number(result.ethFuturePrice).toFixed(2) + " \n";

     ctx.replyWithMarkdown(message);
});

async function get_BTC() {
    try {
        //-------------to get the data via apis ---------------
        var BTC_price = await binance.prices('BTCUSDT');
        var ETH_price = await binance.prices('ETHUSDT');
        var futurePrice = await binance.futuresPrices();
        // var fundingRate = await binance.futuresFundingRate();    
        var BTC_markPrice = await binance.futuresMarkPrice( "BTCUSDT" );    
        var ETH_markPrice = await binance.futuresMarkPrice( "ETHUSDT" );  

        //------ variables to save funding rate of Bitcoin and Ethereum --------
        // var BTC_fundRate = BTC_markPrice.lastFundingRate;
        // var ETH_fundRate = ETH_markPrice.lastFundingRate;

        // //---------- to get funding rate of Bitcoin and Ethereum  ----------
        // fundingRate.map(data => {
        //     if(data.symbol ==='BTCUSDT'){  
        //         BTC_fundRate.push(data.fundingRate);
        //     }  

        //     if(data.symbol ==='ETHUSDT'){  
        //         ETH_fundRate.push(data.fundingRate);
        //     }  
        // });

        return {
            "btcSportPrice" : BTC_price.BTCUSDT,
            "btcFuturePrice" : futurePrice.BTCUSDT,
            "btcFundingRate" : BTC_markPrice.lastFundingRate,
            "ethSportPrice" : ETH_price.ETHUSDT,
            "ethFuturePrice" : futurePrice.ETHUSDT,
            "ethFundingRate" : ETH_markPrice.lastFundingRate
        };
    } catch(err) {
        console.log(err)
    }
}

// setInterval(get_BTC, 5000);

module.exports = router;
