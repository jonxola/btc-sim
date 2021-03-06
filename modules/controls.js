import { setRange, setScale } from './chart.js';

const controls = Vue.createApp({
    data() {
        return {
            activeRange: 'max',
            activeScale: 'linear'
        }
    },
    methods: {
        setRange(range) {
            this.activeRange = range;
            setRange(range);
        },
        setScale(type) {
            this.activeScale = type;
            setScale(type);
        }
    }
}).mount('.controls');