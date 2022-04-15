exports.ArticleInputType = (nexus) => {
    return nexus.inputObjectType({
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
    })
}



