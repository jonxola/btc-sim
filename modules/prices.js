import { date2iso } from './util.js';

const prices = {};

// split full BPI price data into ranges
function setPrices(bpi) {
    const entries = Object.entries(bpi);
    const today = new Date();

    const clip = (start) => {
        const i = entries.findIndex(entry => entry[0] === date2iso(start));
        return Object.fromEntries(entries.slice(i));
    };

    // max data
    prices['max'] = bpi;

    // last 5 years
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setUTCFullYear(today.getUTCFullYear() - 5);
    prices['5y'] = clip(fiveYearsAgo);

    // last year
    const oneYearAgo = new Date();
    oneYearAgo.setUTCFullYear(today.getUTCFullYear() - 1);
    prices['1y'] = clip(oneYearAgo);

    // last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setUTCMonth(today.getUTCMonth() - 6);
    prices['6m'] = clip(sixMonthsAgo);

    // last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(today.getUTCMonth() - 1);
    prices['1m'] = clip(oneMonthAgo);

    // last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setUTCDate(today.getUTCDate() - 7);
    prices['1w'] = clip(oneWeekAgo);
}

function getPrices(range) {
    return prices[range];
}

async function getCurrentPrice() {
    const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    const data = await res.json();
    const price = Number.parseFloat(data.bpi.USD.rate.replace(',', ''));
    return price;
}

export {
    setPrices,
    getPrices,
    getCurrentPrice
};