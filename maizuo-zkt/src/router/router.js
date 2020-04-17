const express = require("express");
const Api = require("../api");
const http = require("http")
const request = require("request")
const querystring = require('querystring')

/**
 * 初始化 router
 */
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world')
})

/**
 * 登录
 */
router.get(`/login`, (req, res) => {
  const options = {
    url: Api.LOGIN_URL,
    form: {
      username: '2057',
      password: '123456'
    },
    headers: {
      Origin: 'http://218.17.157.34:1234',
      Referer: 'http://218.17.157.34:1234/accounts/login/'
    }
  }
  request.post(options, (err, response, body) => {
    console.log('response', response.statusCode)
    if (err) {
      res.send('登录失败')
    }
    const cookies = response.caseless.dict['set-cookie']
    res.cookie('sessionidadms', cookies[0].split(';')[0].split('=')[1])
    res.send('登录成功')
  })
});

/**
 * 打卡记录
 */
router.get('/list', (req, res) => {
  console.log('cookie-req', req.cookies)
  const options = {
    url: Api.FIRST_LAST_URL,
    form: {
      ComeTime: '2020-01-01',
      EndTime: '2020-01-06',
      page: 1,
      rp: 20,
      isForce: 0,
      UserIDs: '3639'
    },
    headers: {
      Origin: 'http://218.17.157.34:1234',
      Referer: 'http://218.17.157.34:1234/page/att/FirstLast/?pure&ComeTime=2020-01-01&EndTime=2020-01-06&DeptIDs=&isForce=0&UserIDs=3639&dept_child=0'
    }
  }
  request.post(options, (err, response, body) => {
    console.log('error', err)
    console.log('response', response.statusCode)
    console.log('body', body)
    res.send(body)
  })
})

module.exports = router;
