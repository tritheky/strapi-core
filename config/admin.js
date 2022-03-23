module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '208b3788c4db71448d138009ee388645'),
  },
});
