/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
import dids from '../dids/index.js';
import {filterByTag} from 'vc-api-test-suite-implementations';

const should = chai.should();
const headers = {
  Accept: 'application/ld+json;profile="https://w3id.org/did-resolution"'
};
const {match, nonMatch} = filterByTag({
  property: 'didResolvers',
  tags: ['Did-Key']
});

describe('did:key Method Tests', function() {
  const summaries = new Set();
  this.summary = summaries;
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.implemented = [...match.keys()];
  this.notImplemented = [...nonMatch.keys()];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Did Key Resolver';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const [name, implementation] of match) {
    const didResolver = implementation.didResolvers.find(
      dr => dr.tags.has('Did-Key'));
    const makeUrl = did =>
      `${didResolver.settings.endpoint}/${encodeURIComponent(did)}`;
    describe(name, function() {
      for(const test of dids) {
        it(test.title, async function() {
          this.test.cell = {columnId: name, rowId: test.row};
          // negative tests here
          if(test.negative === true) {
            const {result, error} = await didResolver.get({
              url: makeUrl(test.did),
              headers
            });
            should.not.exist(result,
              'Expected didResolver to return an error');
            should.exist(error);
            should.exist(error.status, 'Expected error to have a status.');
            // FIXME change this to more exact error codes after the spec
            // is updated.
            error.status.should.be.gte(400, 'Expected a negative status code');
            /*
            error.status.should.eql(test.expected.status,
              'Expected didResolver result status to match expected status.');
            */
            should.exist(error.data, 'Expected error to have data.');
          }
          // positive tests here
          if(test.negative == false) {
            const {result, error} = await didResolver.get({
              url: makeUrl(test.did),
              headers
            });
            should.exist(result,
              'Expected didResolver to return a response.');
            should.not.exist(error, 'Expected no errors from didResolver.');
            result.status.should.eql(test.expected.status,
              'Expected didResolver response status to match expected status.');
            should.exist(result.data,
              'Expected didResolver response data to exist.');
            result.data.should.be.an('object',
              'Expected didResolver response data to be an object.');
            should.exist(result.data.didDocument,
              'Expected a didDocument in the response data.');
            result.data.didDocument.should.eql(test.expected.didDocument,
              'Expected response didDocument to match expected didDocument.');
          }
        });
      }
    });
  }
});
