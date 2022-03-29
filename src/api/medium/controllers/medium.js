'use strict';
var cloudinary = require('cloudinary').v2;
const fs = require('fs');

/**
 *  medium controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::medium.medium', ({
    strapi
}) => ({
    // Method 1: Creating an entirely custom action
    async create(ctx) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true
        });
        const file = ctx.request.files.file;

        await cloudinary.uploader.upload(file.path, (error, result) => {
            if (error)
                return ctx.badRequest(error);
            if (result) {
                ctx.request.body['data'] = {
                    url: result.url
                };
            }
        });

        fs.unlinkSync(file.path);
        const response = await super.create(ctx);
        return response;
    },
}));
