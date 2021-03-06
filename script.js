import { getLatestClose } from './modules/util.js';
import { setPrices } from './modules/prices.js';
import { setRange } from './modules/chart.js';
import './modules/controls.js';
import './modules/wallet.js';
import './modules/order-form.js';

fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=${getLatestClose()}`)
    .then(res => res.json())
    .then(data => {
        setPrices(data.bpi);
        setRange('max');
    })
    .catch(error => {
        alert(`Something went wrong :(\n${error}`);
    });