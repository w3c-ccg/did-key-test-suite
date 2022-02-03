/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const dids = require('../dids');
const implementations = require('../implementations');

const should = chai.should();
// test these implementations' issuers or resolvers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

describe('Ed25519 2020 Tests', function() {
  const summaries = new Set();
  this.summary = summaries;
  // column names for the matrix go here
  const columnNames = [];
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.columns = columnNames;
  this.rowLabel = 'Test Name';
  this.columnLabel = 'DiD Key Resolver';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const resolver of testAPIs) {
    // wrap the testApi config in an Implementation class
    const implementation = new Implementation(resolver);
    describe(resolver.name, function() {
      columnNames.push(resolver.name);
      for(const test of dids) {
        it(test.title, async function() {
          this.test.cell = {columnId: resolver.name, rowId: test.row};
          // negative tests here
          if(test.negative === true) {
            let error;
            let response;
            try {
              response = await implementation.didResolver({did: test.did});
            } catch(e) {
              error = e;
            }
            should.not.exist(response,
              'Expected didResolver to return an error');
            should.exist(error);
            should.exist(error.status, 'Expected error to have a status.');
            error.status.should.eql(test.expected.status,
              'Expected didResolver response status to match expected status.');
            should.exist(error.data, 'Expected error to have data.');
            should.exist(
              error.data.didDocument,
              'Expected error data to have a didDocument'
            );
            error.data.didDocument.should.eql(test.expected.didDocument);
          }
          // positive tests here
          if(test.negative == false) {
            let error;
            let response;
            try {
              response = await implementation.didResolver({did: test.did});
            } catch(e) {
              error = e;
            }
            should.exist(response,
              'Expected didResolver to return a response.');
            should.not.exist(error, 'Expected no errors from didResolver.');
            response.status.should.eql(test.expected.status,
              'Expected didResolver response status to match expected status.');
            should.exist(response.data,
              'Expected didResolver response data to exist.');
            response.data.should.be.an('object',
              'Expected didResolver response data to be an object.');
            should.exist(response.data.didDocument,
              'Expected a didDocument in the response data.');
            response.data.didDocument.should.eql(test.expected.didDocument,
              'Expected response didDocument to match expected didDocument.');
          }
        });
      }
    });
  }
});
