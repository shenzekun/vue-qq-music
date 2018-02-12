const mixin = {
    filters: {
        dealNum(num) {
            return (num / 10000).toFixed(1) + '万';
        }
    }
};

export default mixin;
