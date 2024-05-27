const { ENV_KEYS } = require('./Constants');

require('dotenv').config();

const environment = process.env.NODE_ENV || 'development'; // Default to development

if (environment === 'development') {
  require('dotenv').config({ path: '.env.development' });
} else if (environment === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config({ path: '.env.production' });
}

function getJwtSecret() {
  return process.env[ENV_KEYS.JWT_SECRET];
}

module.exports = { getJwtSecret }