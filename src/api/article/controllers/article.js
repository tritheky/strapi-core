'use strict';
/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({
    strapi
}) => ({
    async create(ctx) {
        const transacting = await strapi.db.connection.transaction();
        const data = ctx.request.body.data;
        try {
            data['article_sections'] = [];  
            for (let index = 0; index < data.sections.length; index++) {
                const element = data.sections[index];
                const resultSection = await strapi.db.query('api::article-section.article-section')
                    .create({ data: element.data }, { transacting });
                data['article_sections'].push(resultSection.id);
            }

            delete data.sections;
            const result = await strapi.db.query('api::article.article')
                .create({ data: data }, { transacting });
            await transacting.commit();
            return result;
        } catch (err) {
            await transacting.rollback();
            return ctx.badRequest(`ROLLBACK error: ${err}`);
        }


    }
}));
