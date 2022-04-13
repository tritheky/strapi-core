const { getService } = require("../../utils/index");

module.exports = (plugin) => {
    plugin.controllers.user.refreshToken = async (context) => {
        const { token } = context.request.body;
        const payload = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        return getService('jwt').issue({
            id: payload.id
        })
    }

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/refreshToken',
        handler: 'user.refreshToken'
    });

    return plugin;
}