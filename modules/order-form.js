import { date2iso, getLatestClose, getRecurringDates } from './util.js';
import { getPrices } from './prices.js';
import { wallet } from './wallet.js';

const orderForm = Vue.createApp({
    data() {
        return {
            type: 'single',
            single: {
                date: '',
                usd: ''
            },
            recurring: {
                start: '',
                end: '',
                freq: '1',
                usd: ''
            },
            latestClose: getLatestClose(),
            focused: ''
        }
    },
    watch: {
        type() {
            this.focus('');
        }
    },
    methods: {
        onSubmit() {
            if (this.type === 'single') this.singleOrder();
            else if (this.type === 'recurring') this.recurringOrder();
        },
        singleOrder() {
            const date = this.single.date;
            const price = getPrices('max')[date];
            const usd = Number.parseFloat(this.single.usd);
            const btc = usd / price;
            wallet.addOrder(date, price, usd, btc);
        },
        recurringOrder() {
            const start = new Date(this.recurring.start);
            const end = new Date(this.recurring.end);
            const freq = Number.parseInt(this.recurring.freq);
            const usd = Number.parseFloat(this.recurring.usd);

            if (start >= end) {
                alert('End date must be later than start date.');
                return;
            }

            const dates = getRecurringDates(start, end, freq);
            for (const d of dates) {
                const date = date2iso(d);
                const price = getPrices('max')[date];
                const btc = usd / price;
                wallet.addOrder(date, price, usd, btc);
            }
        },
        focus(field) {
            this.focused = field;
        },
        autofillDate(date) {
            if (this.focused === 'date') {
                this.single.date = date;
            } else if (this.focused === 'start') {
                this.recurring.start = date;
            } else if (this.focused === 'end') {
                this.recurring.end = date;
            }
        }
    }
}).mount('.order-form');

export { orderForm };