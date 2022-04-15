
exports.resolveArticles = async (parent, args) => {
    const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
    const { data } = args;
    const transacting = await strapi.db.connection.transaction();
    try {
      data['article_sections'] = [];
      for (let index = 0; index < data.sections.length; index++) {
        const element = data.sections[index];
        const resultSection = await strapi.db.query('api::article-section.article-section')
          .create({ data: element }, { transacting });
        data['article_sections'].push(resultSection.id);
      }
      delete data.sections;
      const result = await strapi.db.query('api::article.article').create({ data: data }, { transacting });
      await transacting.commit();
      return toEntityResponse(result, { args, resourceUID: 'api::article.article' });
    } catch (error) {
      await transacting.rollback();
      throw new Error(error)
    }
}