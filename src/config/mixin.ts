const mixin = {
    filters: {
        dealNum(num) {
            return (num / 10000).toFixed(1) + '万';
        },
        formatTime(seconds) {
            let mins: any = Math.floor(seconds / 60);
            let secs: any = Math.floor(seconds % 60);
            if (mins < 10) {
                mins = '0' + mins;
            }
            if (secs < 10) {
                secs = '0' + secs;
            }
            return `${mins}:${secs}`;
        }
    }
};

export default mixin;
