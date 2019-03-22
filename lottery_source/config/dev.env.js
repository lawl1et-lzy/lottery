'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BRANCH_ENV: JSON.stringify(process.env.BRANCH_ENV) || '"wechat"'
})
