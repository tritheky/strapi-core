'use strict';

/**
 *  post controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({
  strapi
}) => ({
  // Method 1: Creating an entirely custom action
  async create(ctx) {
    const newPost = ctx.request.body.data;
    const entries = await strapi.entityService.findMany('api::post.post', {
      fields: ['Code'],
      sort: {
        Code: 'DESC'
      },
    });
    newPost.Code = (Number(entries[0].Code) + 1).toString();
    newPost['status'] = 'Published';
    // some logic here
    const response = await super.create(ctx);
    // some more logic

    return response;
  },
}));
