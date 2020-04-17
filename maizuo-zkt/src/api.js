const BASE_URL = 'http://218.17.157.34:1234'
/**
 * 登录
 */
const LOGIN_URL = `${BASE_URL}/selfservice/login/`
/**
 * 最早最晚打卡记录列表
 */
const FIRST_LAST_URL = `${BASE_URL}/grid/att/FirstLast/`

module.exports = {
    BASE_URL,
    LOGIN_URL,
    FIRST_LAST_URL
}