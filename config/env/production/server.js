module.exports = ({ env }) => ({
  url: env('MY_HEROKU_URL'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    },
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});