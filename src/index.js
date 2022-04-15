'use strict';

const { ArticleInputType } = require("./api/article/content-types/article/inputTypes");
const { resolveArticles, resolveUpdateArticles } = require("./api/article/content-types/article/resolve");

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
      const ArticleInputTypeInstance = ArticleInputType(nexus);
      return {
        types: [
          nexus.extendType({
            type: 'Mutation',
            definition: (t) => {
              t.field("createArticleMutation", {
                type: 'ArticleEntityResponse',
                args: { data: ArticleInputTypeInstance },
                async resolve(parent, args) {
                  return resolveArticles(parent, args)
                }
              })
            }
          }),
          nexus.extendType({
            type: 'Mutation',
            definition: (t) => {
              t.field("UpdateArticleMutation", {
                type: 'ArticleEntityResponse',
                args: { data: ArticleInputTypeInstance, id: nexus.nonNull('ID') },
                async resolve(parent, args) {
                  return resolveUpdateArticles(parent, args)
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