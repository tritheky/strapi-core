'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");
    const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
    const extension = ({ nexus }) => {
      const ArticleInputType = nexus.inputObjectType({
        name: 'ArticleInputType',
        definition(t) {
          t.nonNull.list.field('sections', {
            type: 'ArticleSectionInput',
          })
          t.nonNull.string('title')
          t.nonNull.id('type')
          t.nonNull.string('summary')
          t.nonNull.string('code')
          t.nonNull.id('medium')
          t.nonNull.id('category')
          t.nonNull.string('body')
        }
      });

      return {
        types: [
          nexus.extendType({
            type: 'Mutation',
            definition: (t) => {
              t.field("createArticleMutation", {
                type: 'ArticleEntityResponse',
                args: { data: ArticleInputType },
                async resolve(parent, args) {
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
                    console.log(data)
                    const result = await strapi.db.query('api::article.article').create({ data: data }, { transacting });
                    await transacting.commit();
                    return toEntityResponse(result, { args, resourceUID: 'api::article.article' });
                  } catch (error) {
                    await transacting.rollback();
                    throw new Error(error)
                  }
                }
              })
            }
          })
        ]
      }

    }
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};