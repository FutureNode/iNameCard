'use strict';

exports.port = process.env.PORT || 8000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/inamecard'
};
exports.companyName = 'iShow, Inc.';
exports.projectName = 'iShow';
exports.systemEmail = 'inamecard@model.com.tw';
exports.cryptoKey = '1qaz#@EDEdfvG&859876';
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Service',
    address: process.env.SMTP_FROM_ADDRESS || 'inamecard@model.com.tw'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'inamecard@model.com.tw',
    password: process.env.SMTP_PASSWORD || '7ujm8ik,',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '559472494127349',
    secret: process.env.FACEBOOK_OAUTH_SECRET || '6f112f4168ef95013645cb202da7bf61'
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || 'd6daa33b7f5997c738a1',
    secret: process.env.GITHUB_OAUTH_SECRET || '96e9da3306a76873e248bb9e23f527463d3cf441'
  }
};
