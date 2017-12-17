function formatTime(timestamp) {
    let hour = parseInt(timestamp / 3600000, 10);
    let minute = parseInt(((timestamp - hour * 3600000) / 60000), 10);
    let second = parseInt(timestamp / 1000 - 3600 * hour - 60 * minute, 10);
    let formatedTime = hour + "小时" + minute + "分钟" + second + "秒";

    return formatedTime;
}

module.exports = {
    formatTime
}