const axios = require('axios');
const dotenv = require('dotenv').config();

const buyIn = 0.00018104;

// Get Price Every 5 Seconds
setInterval(async () => {
    let res = false;

    try {
        res = await axios.get('https://api.binance.com/api/v1/ticker/price?symbol=TRXETH');
    } catch(e) {
        console.log(e);
    }

    console.log(res.data.price);

    if (res.data.price >= buyIn) {
        try {
            await notifyMe(res.data.price);
            process.exit();
        } catch (e) {
            console.log(`ERROR: ${e}`);
        }
    }
}, 5000);

function notifyMe(price) {
    const client = require('twilio')(
        process.env.TWILIO_SID,
        process.env.TWILIO_SECRET
    );

    return client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER,
        body: `TRX going up! Its currently at ${price}`
    });
}