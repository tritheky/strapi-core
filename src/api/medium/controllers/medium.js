'use strict';
var cloudinary = require('cloudinary').v2;
const fs = require('fs');
const _ = require('lodash');

/**
 *  medium controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::medium.medium', ({
    strapi
}) => ({
    // Method 1: Creating an entirely custom action
    async create(ctx) {
        if (_.isNull(ctx.request.files) || _.isEmpty(ctx.request.files) || ctx.request.files.file.size == 0)
            return ctx.badRequest('File not found ');

        if (_.isNull(ctx.request.body.data) || _.isEmpty(ctx.request.body.data))
            return ctx.badRequest('data not found!');
        const newMedium = JSON.parse(ctx.request.body.data);
        if (_.isNull(newMedium.type_code) || _.isEmpty(newMedium.type_code))
            return ctx.badRequest('Type code not found!');

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true
        });
        const file = ctx.request.files.file;

        await cloudinary.uploader.upload(file.path, (error, result) => {
            if (error) {
                fs.unlinkSync(file.path);
                return ctx.badRequest(error);
            }

            if (result) {
                fs.unlinkSync(file.path);
                newMedium['name'] = file.name;
                newMedium["url"] = result.url.replace(`http://res.cloudinary.com/${process.env.CLOUDINARY_NAME}`, '');
            }
        });
        const entries = await strapi.entityService.findMany('api::medium-type.medium-type', {
            filters: { code: newMedium.type_code },
        });
        if (!entries || entries.length == 0)
            return ctx.badRequest('Type code incorrect!');
        newMedium['medium_type'] = entries[0].id;
        ctx.request.files = {};
        ctx.request.body.data = JSON.stringify(newMedium);
        const response = await super.create(ctx);
        return response;
    },
}));
