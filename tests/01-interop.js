/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const Implementation = require('./Implementation');
const credentials = require('../credentials');
const {testCredential} = require('./assertions');
const implementations = require('../implementations');
const {unwrapResponse} = require('./helpers');

const should = chai.should();
// test these implementations' implementations or verifiers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

describe('DiD Key Tests', function() {
  const summaries = new Set();
  this.summary = summaries;
  for(const credential of credentials) {
    const {credentialSubject: {id}} = credential;
    describe(`VC ${id}`, function() {
      // column names for the matrix go here
      const columnNames = [];
      const reportData = [];
      const images = [];
      // this will tell the report
      // to make an interop matrix with this suite
      this.matrix = true;
      this.report = true;
      this.columns = columnNames;
      this.rowLabel = 'Issuer';
      this.columnLabel = 'Implementation';
      // the reportData will be displayed under the test title
      this.reportData = reportData;
      this.images = images;

      for(const vendor of testAPIs) {
        // this is the credential for the verifier tests
        let issuedVC = null;
        //FIXME implementationResponse should be used to check status 201
        //let implementationResponse = null;
        let error = null;
        describe(vendor.name, function() {
          before(async function() {
            try {
              // ensure this implementation is a column in the matrix
              columnNames.push(vendor.name);
              const implementation = new Implementation(vendor);
              const response = await implementation.issue({credential});
              //FIXME implementationResponse should be used to check status 201
              //implementationResponse = response;
              // this credential is not tested
              // we just send it to each verifier
              issuedVC = unwrapResponse(response.data);
            } catch(e) {
              console.error(`${vendor.name} failed to issue a ` +
                'credential for verification tests', e);
              error = e;
            }
          });
          // this ensures the implementation implementation
          // issues correctly
          it(`should be issued by ${vendor.name}`, async function() {
            should.exist(
              credential, `Expected VC from ${vendor.name} to exist.`);
            should.not.exist(error, `Expected ${vendor.name} to not ` +
              `error.`);

            // FIXME implementation should return 201
            //implementationResponse.status.should.equal(201);

            testCredential(issuedVC);
            issuedVC.credentialSubject.should.eql(
              credential.credentialSubject);
          });
        });
      }
    });
  }
});
