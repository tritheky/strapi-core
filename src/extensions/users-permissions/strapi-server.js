const { getService } = require("../../utils/index");
const jwt = require('jsonwebtoken');

module.exports = (plugin) => {
    plugin.controllers.user.refreshToken = async (context) => {
        const { token, userId } = context.request.body;
        if(token && userId) {
            return getService('jwt').issue({
                id: userId
            })
        }
    }

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/refreshToken',
        handler: 'user.refreshToken'
    });

    return plugin;
}