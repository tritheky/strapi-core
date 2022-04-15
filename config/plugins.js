module.exports = ({ env }) => ({
    // ...
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: process.env.JWT_EXPIRE
        },
      },
    },
    // ...
  });