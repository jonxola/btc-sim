import { getCurrentPrice } from './prices.js';
import { showOrders } from './chart.js';
import { formatUsd, formatBtc, formatPct, formatDate } from './util.js';

const wallet = Vue.createApp({
    data() {
        return {
            orders: [],
            currentPrice: 0
        }
    },
    computed: {
        btc() {
            return this.orders.reduce((btc, order) => btc + order.btc, 0);
        },
        usd() {
            return this.btc * this.currentPrice;
        },
        totalCost() {
            return this.orders.reduce((cost, order) => cost + order.usd, 0);
        },
        avgCost() {
            return this.btc ? this.totalCost / this.btc : 0;
        },
        totalReturn() {
            return this.usd - this.totalCost;
        },
        totalReturnPct() {
            return this.totalCost ? this.totalReturn / this.totalCost * 100 : 0;
        }
    },
    watch: {
        orders: {
            deep: true,
            handler() {
                showOrders(this.orders);
            }
        }
    },
    created() {
        this.updatePrice();
        setInterval(this.updatePrice, 1000 * 30);
    },
    methods: {
        addOrder(date, price, usd, btc) {
            this.orders.unshift({ date, price, usd, btc });
        },
        removeOrder(index) {
            this.orders.splice(index, 1);
        },
        clearOrders() {
            this.orders = [];
        },
        updatePrice() {
            getCurrentPrice().then(price => {
                this.currentPrice = price;
            });
        },
        formatUsd,
        formatBtc,
        formatPct,
        formatDate
    }
}).mount('.wallet');

export {
    wallet
};