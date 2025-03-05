require('dotenv').config({ path: '.env' });

module.exports = {
  "/proxy": {
    target: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT || '3321'}`,
    "pathRewrite": {"^/proxy": ""},
    "recure": false
  }
}