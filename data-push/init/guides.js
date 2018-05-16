const { Observable } = require('rxjs');
const _ = require('lodash');
const { client } = require('../../algolia');
const { getGuideArticleData } = require('../../data-sources/guides');
const { logger } = require('../../utils');

const log = logger('init:guides');

const index = client.initIndex('guides');

index.setSettings(
  {
    searchableAttributes: ['title', 'content', 'category'],
    distinct: true,
    attributeForDistinct: 'id',
    attributesForFaceting: ['category'],
    attributesToHighlight: ['title']
  },
  (err, response) => {
    if (err) {
      log(err.message, 'red');
      log(err.debugData);
      throw new Error(err);
    }
    log('setSettings\n' + JSON.stringify(response, null, 2));
  }
);

exports.insertGuides = function insertGuides() {
  return getGuideArticleData()
    .flatMap(articles => Observable.from(_.chunk(articles, 100)))
    .subscribe(
      articles => {
        index.addObjects(articles, err => {
          if (err) {
            throw new Error(err);
          }
        });
      },
      err => {
        throw new Error(err);
      },
      () => log('complete', 'blue')
    );
};
