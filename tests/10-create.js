/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

import {
  shouldBeDidResolverResponse,
  shouldErrorWithData,
  shouldHaveDidResolutionError
} from './assertions.js';
import chai from 'chai';
import {filterByTag} from 'vc-api-test-suite-implementations';
import {splitDid} from './helpers.js';

const should = chai.should();
const headers = {
  Accept: 'application/ld+json;profile="https://w3id.org/did-resolution"'
};
//FIXME we need a way of getting dids from different implementers into
//the test suite.
const did = 'did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b';
const {match, nonMatch} = filterByTag({
  property: 'didResolvers',
  tags: ['Did-Key']
});

describe('did:key Create Operation', function() {
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
      it('The scheme MUST be the value `did`', async () => {
        const {scheme} = splitDid({did});
        should.exist(scheme, 'Expected first part of the did to exist.');
        scheme.should.be.a('string', 'Expected did scheme to be a string.');
        scheme.should.equal('did', 'Expected scheme to be "did"');
      });
      it('MUST raise INVALID_DID error if scheme is not `did`', async () => {
        const noScheme = did.replace(/^did:/, '');
        const {result, error} = await didResolver.get({
          url: makeUrl(noScheme),
          headers
        });
        shouldErrorWithData(result, error);
        const {data} = error;
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'INVALID_DID');
      });
      it('The method MUST be the value `key`', async () => {
        const {method} = splitDid({did});
        should.exist(method, 'Expected did to have a method');
        method.should.be.a('string', 'Expected method to be a string');
        method.should.equal('key', 'Expected method to equal key');
      });
      //FIXME non key did methods do exist so we need one that we know
      //is not a registered did method
      it('MUST raise INVALID_DID error if method is not `key`', async () => {
        const {parts} = splitDid({did});
        // use the first part and everything after the second part
        const noMethod = `${parts[0]}:${parts.slice(2).join(':')}`;
        const {result, error} = await didResolver.get({
          url: makeUrl(noMethod),
          headers
        });
        shouldErrorWithData(result, error);
        const {data} = error;
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'INVALID_DID');
      });
      it('The version MUST be convertible to a positive integer value.',
        async () => {
          const {version} = splitDid({did});
          should.exist(version, `Expected ${did} to have a version.`);
          let integer;
          let error;
          try {
            integer = Number.parseInt(version);
          } catch(e) {
            error = e;
          }
          should.not.exist(
            error,
            'Expected conversion of "version" to an Integer to not error'
          );
          should.exist(integer, 'Expected conversion of "version" to exist');
          Number.isInteger(integer).should.equal(
            true,
            'Expected "version" to be an Integer'
          );
          integer.should.be.gte(0, 'Expected "version" to be positive');
        });
      it('MUST raise INVALID_ID if version is not convertible to a ' +
        'positive integer value.', async () => {
        const didParts = splitDid({did});
        const invalidVersionDid = `${didParts.scheme}:${didParts.method}:` +
          `-v4:${didParts.multibase}`;
        const {result, error} = await didResolver.get({
          url: makeUrl(invalidVersionDid),
          headers
        });
        shouldErrorWithData(result, error);
        const {data} = error;
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'INVALID_ID');
      });
      it('The multibaseValue MUST be a string and begin with the letter `z`',
        async () => {

        });
      it('MUST raise INVALID_ID if the multibaseValue does not begin with ' +
        'the letter `z`.', async () => {

      });
      it('If document.id is not a valid DID, an INVALID_DID error MUST be ' +
        'raised', async () => {

      });
      it('If the byte length of rawPublicKeyBytes does not match the ' +
        'expected public key length for the associated multicodecValue, ' +
        'an INVALID_PUBLIC_KEY_LENGTH error MUST be raised.', async () => {

      });
      it('If an invalid public key value is detected, an INVALID_PUBLIC_KEY ' +
        'error MUST be raised.', async () => {

      });
      it('If verificationMethod.id is not a valid DID URL, an ' +
        'INVALID_DID_URL error MUST be raised.', async () => {

      });
      it('If publicKeyFormat is not known to the implementation, an ' +
        'UNSUPPORTED_PUBLIC_KEY_TYPE error MUST be raised.', async () => {

      });
      it('For Signature Verification Methods, if ' +
        'options.enableExperimentalPublicKeyTypes is set to false and ' +
        'publicKeyFormat is not Multikey, JsonWebKey2020, or ' +
        'Ed25519VerificationKey2020, an INVALID_PUBLIC_KEY_TYPE error ' +
        'MUST be raised.', async () => {

      });
      it('For Encryption Verification Methods, if ' +
        'options.enableExperimentalPublicKeyTypes is set to false and ' +
        'publicKeyFormat is not Multikey, JsonWebKey2020, or ' +
        'X25519KeyAgreementKey2020, an INVALID_PUBLIC_KEY_TYPE error ' +
        'MUST be raised.', async () => {

      });
      it('If verificationMethod.controller is not a valid DID, an ' +
        'INVALID_DID error MUST be raised.', async () => {

      });
    });
  }
});
