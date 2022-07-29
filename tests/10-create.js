/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

import {generateMultibase, splitDid} from './helpers.js';
import {
  shouldBeDidResolverResponse,
  shouldBeValidDid,
  shouldErrorWithData,
  shouldHaveDidDereferencingError,
  shouldHaveDidResolutionError,
  shouldHaveValidVersion
} from './assertions.js';
import chai from 'chai';
import {filterByTag} from 'vc-api-test-suite-implementations';

const should = chai.should();
const headers = {
  Accept: 'application/ld+json;profile="https://w3id.org/did-resolution"'
};

// default valid bs58 ed25519 did
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
  this.columnLabel = 'did:key Resolver';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const [columnId, implementation] of match) {
    const didResolver = implementation.didResolvers.find(
      dr => dr.tags.has('Did-Key'));
    const makeUrl = did =>
      `${didResolver.settings.endpoint}/${encodeURIComponent(did)}`;
    describe(columnId, function() {
      it('The scheme MUST be the value `did`', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {scheme} = splitDid({did});
        should.exist(scheme, 'Expected first part of the did to exist.');
        scheme.should.be.a('string', 'Expected did scheme to be a string.');
        scheme.should.equal('did', 'Expected scheme to be "did"');
      });
      it('MUST raise `invalidDid` error if scheme is not `did`',
        async function() {
          this.test.cell = {columnId, rowId: this.test.title};
          const noDidScheme = did.replace(/^did:/, 'notDid');
          const {result, error} = await didResolver.get({
            url: makeUrl(noDidScheme),
            headers
          });
          shouldErrorWithData(result, error);
          const {data} = error;
          shouldBeDidResolverResponse(data);
          shouldHaveDidResolutionError(data, 'invalidDid');
        });
      it('The method MUST be the value `key`', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {method} = splitDid({did});
        should.exist(method, 'Expected did to have a method');
        method.should.be.a('string', 'Expected method to be a string');
        method.should.equal('key', 'Expected method to equal key');
      });
      it('MUST raise `invalidDid` error if method is not `key`',
        async function() {
          this.test.cell = {columnId, rowId: this.test.title};
          const {parts} = splitDid({did});
          // use the first part and everything after the second part
          const methodNotKey = `${parts[0]}:notKey:${parts.slice(2).join(':')}`;
          const {result, error} = await didResolver.get({
            url: makeUrl(methodNotKey),
            headers
          });
          shouldErrorWithData(result, error);
          const {data} = error;
          shouldBeDidResolverResponse(data);
          shouldHaveDidResolutionError(data, 'invalidDid');
        });
      it('The version MUST be convertible to a positive integer value.',
        async function() {
          this.test.cell = {columnId, rowId: this.test.title};
          const {version} = splitDid({did});
          should.exist(version, `Expected ${did} to have a version.`);
          shouldHaveValidVersion(version);
        });
      it('MUST raise `invalidId` if version is not convertible to a ' +
        'positive integer value.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const didParts = splitDid({did});
        const invalidVersionDid = `${didParts.scheme}:${didParts.method}:` +
          `-4:${didParts.multibase}`;
        const {result, error} = await didResolver.get({
          url: makeUrl(invalidVersionDid),
          headers
        });
        shouldErrorWithData(result, error);
        const {data} = error;
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'invalidId');
      });
      it('The multibaseValue MUST be a string and begin with the letter `z`',
        async function() {
          this.test.cell = {columnId, rowId: this.test.title};
          const {multibase} = splitDid({did});
          should.exist(multibase, 'Expected multibase to exist');
          multibase.should.be.a('string', 'Expected multibase to be a string');
          multibase.startsWith('z').should.equal(
            true,
            'Expected multibase to start with z'
          );
        });
      it('MUST raise `invalidId` if the multibaseValue does not begin with ' +
        'the letter `z`.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const didParts = splitDid({did});
        const invalidMultibaseDid = `${didParts.scheme}:${didParts.method}:` +
          `${didParts.multibase.replace(/^z/, '')}`;
        const {result, error} = await didResolver.get({
          url: makeUrl(invalidMultibaseDid),
          headers
        });
        shouldErrorWithData(result, error);
        const {data} = error;
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'invalidId');
      });
      it('If "didDocument.id" is not a valid DID, an `invalidDid` error MUST ' +
        'be raised', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        // @ is not a valid character for a did identifier or version
        const invalidDid = 'did:key:@';
        const {result, error, data} = await didResolver.get({
          url: makeUrl(invalidDid),
          headers
        });
        should.exist(error, `Expected resolution of ${invalidDid} to error`);
        should.not.exist(result, 'Expected no response.');
        should.exist(
          data,
          `Expected resolution of ${invalidDid} to return a response`
        );
        shouldBeDidResolverResponse(data);
        // FIXME this doesn't seem right we should not expect a didDocument
        // for an invalid did
        should.exist(data.didDocument, 'Expected a didDocument');
        data.didDocument.should.not.eql(
          {},
          'Expected a didDocument'
        );
        data.didDocument.id.should.be.a(
          'string',
          'Expected "didDocument.id" to be a string'
        );
        shouldHaveDidResolutionError(data, 'invalidDid');
      });
      it('If the byte length of rawPublicKeyBytes does not match the ' +
        'expected public key length for the associated multicodecValue, ' +
        'an `invalidPublicKeyLength` error MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const publicKey512Bytes = await generateMultibase({bitLength: 512});
        const invalidKeyLengthDid = `did:key:${publicKey512Bytes}`;
        const {result, error, data} = await didResolver.get({
          url: makeUrl(invalidKeyLengthDid),
          headers
        });
        shouldErrorWithData(result, error);
        shouldBeDidResolverResponse(data);
        shouldHaveDidResolutionError(data, 'invalidPublicKeyLength');
      });
      /**
       * Ensure the rawPublicKeyBytes are a proper encoding of the public key
       * type as specified by the multicodecValue. This validation is often
       * done by a cryptographic library when importing the public key by,
       * for example, ensuring that an Elliptic Curve public key is a
       * specific coordinate that exists on the elliptic curve. If an
       * invalid public key value is detected, an invalidPublicKey error
       * MUST be raised.
       */
      it.skip('If an invalid public key value is detected, an `invalid' +
        'PublicKey` error MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
      });
      it('If verificationMethod.id is not a valid DID URL, an ' +
        '`invalidDidUrl` error MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {multibase} = splitDid({did});
        const invalidDidUrl = `${did}/?query=true#${multibase}`;
        const {result, error, data} = await didResolver.get({
          url: makeUrl(invalidDidUrl),
          headers
        });
        shouldErrorWithData(result, error);
        shouldBeDidResolverResponse(data);
        shouldHaveDidDereferencingError(data, 'invalidDidUrl');
      });
      it('If publicKeyFormat is not known to the implementation, an ' +
        '`unsupportedPublicKeyType` error MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {result, error, data} = await didResolver.get({
          url: makeUrl(did),
          headers,
          searchParams: {
            publicKeyFormat: 'unknown'
          }
        });
        shouldErrorWithData(result, error);
        shouldHaveDidResolutionError(data, 'unsupportedPublicKeyType');
      });
      it('For Signature Verification Methods, if ' +
        'options.enableExperimentalPublicKeyTypes is set to false and ' +
        'publicKeyFormat is not Multikey, JsonWebKey2020, or ' +
        'Ed25519VerificationKey2020, an `invalidPublicKeyType` error ' +
        'MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {result, error, data} = await didResolver.get({
          url: makeUrl(did),
          headers,
          searchParams: {
            publicKeyFormat: 'newFormat',
            enableExperimentalPublicKeyTypes: false
          }
        });
        shouldErrorWithData(result, error);
        shouldHaveDidResolutionError(data, 'invalidPublicKeyType');
      });
      it('For Encryption Verification Methods, if ' +
        'options.enableExperimentalPublicKeyTypes is set to false and ' +
        'publicKeyFormat is not Multikey, JsonWebKey2020, or ' +
        'X25519KeyAgreementKey2020, an `invalidPublicKeyType` error ' +
        'MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {multibase} = splitDid({did});
        const didUrl = `${did}#${multibase}`;
        const {result, error, data} = await didResolver.get({
          url: makeUrl(didUrl),
          headers,
          searchParams: {
            publicKeyFormat: 'newFormat',
            enableExperimentalPublicKeyTypes: false
          }
        });
        shouldErrorWithData(result, error);
        shouldHaveDidResolutionError(data, 'invalidPublicKeyType');
      });
      it('If verificationMethod.controller is not a valid DID, an ' +
        '`invalidDid` error MUST be raised.', async function() {
        this.test.cell = {columnId, rowId: this.test.title};
        const {multibase} = splitDid({did});
        const didUrl = `${did}#${multibase}`;
        const {result, error, data} = await didResolver.get({
          url: makeUrl(didUrl),
          headers
        });
        should.exist(result, 'Expected a result');
        should.not.exist(error, 'Did not expect an error');
        shouldBeDidResolverResponse(data);
        const {didDocument} = data;
        didDocument.should.have.property('controller');
        const {controller} = didDocument;
        const didParts = splitDid({did: controller});
        let didError;
        try {
          shouldBeValidDid(didParts);
        } catch(e) {
          didError = e;
        }
        if(didError) {
          shouldHaveDidDereferencingError(data, 'invalidDid');
        }
      });
    });
  }
});
