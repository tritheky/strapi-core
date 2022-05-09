const operation = require("sharp/lib/operation");

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
};

exports.resolveUpdateArticles = async (parent, args) => {
    const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
    const { data, id } = args;
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
      const result = await strapi.db.query('api::article.article').update({ data, where: { id } }, { transacting });
      await transacting.commit();
      return toEntityResponse(result, { args, resourceUID: 'api::article.article' });
    } catch (error) {
      await transacting.rollback();
      throw new Error(error)
    }
}

exports.resolveUpdateStatus = async (parent, args) => {
  const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
  const { ids } = args;
  const transacting = await strapi.db.connection.transaction();
  try {
    await strapi.db.query('api::article.article').updateMany({ data: { publishedAt: operation === "publish" ? null : new Date() }, where: { id: { $in: ids } } }, { transacting });
    await transacting.commit();
    return toEntityResponse({ success: true });
  } catch (error) {
    await transacting.rollback();
    throw new Error(error)
  }
}

exports.resolveDeleteUser = async (parent, args) => {
  const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
  const { id } = args;
  const transacting = await strapi.db.connection.transaction();
  try {
    const result = await strapi.query('plugin::users-permissions.user').delete({ where: { id } }, { transacting });
    await transacting.commit();
    return toEntityResponse(result, { args, resourceUID: 'plugin::users-permissions.user' });
  } catch (error) {
    await transacting.rollback();
    throw new Error(error)
  }
}