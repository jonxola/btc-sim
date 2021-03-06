// Date object -> 'YYYY-MM-DD'
function date2iso(d) {
    return d.toISOString().substring(0, 10);
}

// 'YYYY-MM-DD' -> Date object
function iso2date(str) {
    const y = str.substring(0, 4);
    const m = str.substring(5, 7) - 1;
    const d = str.substring(8);
    return new Date(Date.UTC(y, m, d));
}

// Date object -> 'Sep 29 2001' 
function shortDate(d) {
    return d.toUTCString().substring(5, 16);
}

// '2001-09-29' -> 'Sep 29 2001'
function formatDate(str) {
    return shortDate(iso2date(str));
}

// $x.xx
function formatUsd(usd) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd);
}

// x.xxxxxxxx BTC
function formatBtc(btc) {
    return Number.parseFloat(btc).toFixed(8) + ' BTC';
}

// x.xx%
function formatPct(pct) {
    return Number.parseFloat(pct).toFixed(2) + '%';
}

// get the date of the latest closing price
function getLatestClose() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return date2iso(d);
}

// get dates every [freq] days from start to end
function getRecurringDates(start, end, freq) {
    const dates = [];
    let currentDate = start;
    
    while (currentDate <= end) {
        dates.push(new Date(currentDate.getTime()));
        
        const next = new Date(currentDate.getTime());
        next.setUTCDate(currentDate.getUTCDate() + freq);
        currentDate = next;
    }

    return dates;
}

export {
    date2iso,
    iso2date,
    shortDate,
    getLatestClose,
    getRecurringDates,
    formatUsd,
    formatBtc,
    formatPct,
    formatDate
};