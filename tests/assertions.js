/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';

const should = chai.should();

/**
 * Tests the properties of a did resolver return.
 *
 * @param {object} data - The data from a did resolver.
 *
 * @returns {undefined} Just returns on success.
 */
export const shouldBeDidResolverResponse = data => {
  const resolverResponse = 'DID Resolver response';
  should.exist(data, `Expected ${resolverResponse} to have data.`);
  data.should.be.an(
    'object',
    `Expected ${resolverResponse} data to be an object`
  );
  data.should.have.property('didDocument');
  data.should.have.property('@context');
  data.should.have.property('didDocumentMetadata');
  const didMetaData = data.didDereferencingMetadata ||
    data.didResolutionMetadata;
  should.exist(didMetaData, 'Expected didResolver data to have either' +
    ' "didDereferencingMetadata" or "didResolutionMetadata"');
};

export const shouldErrorWithData = (response, error) => {
  should.not.exist(response, 'Expected no response');
  should.exist(error, 'Expected an error');
  should.exist(error.data, 'Expected an error with data');
};

export const shouldHaveDidResolutionError = (data, didError) => {
  return _shouldHaveMetadataError(data, didError, 'didResolutionMetadata');
};

export const shouldHaveDidDereferencingError = (data, didError) => {
  return _shouldHaveMetadataError(data, didError, 'didDereferencingMetadata');
};

export const shouldHaveValidVersion = version => {
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
  integer.should.be.gt(0, 'Expected "version" to be positive');
};

// takes the result of splitDid and checks it
export const shouldBeValidDid = didParts => {
  should.exist(didParts, 'Expected didParts to exist');
  didParts.should.be.an('object', 'Expected didParts to be an object');
  didParts.should.have.property('scheme');
  didParts.scheme.should.be.a('string', 'Expected scheme to be a string');
  didParts.scheme.should.equal('did', 'Expected scheme to be a did');
  didParts.should.have.property('method');
  didParts.method.should.be.a('string', 'Expected method to be a string');
  didParts.method.should.equal('key', 'Expected did method to be key');
  didParts.should.have.property('version');
  shouldHaveValidVersion(didParts.version);
  should.exist(didParts.multibase, 'Expected there to be a multibaseValue');
};

function _shouldHaveMetadataError(data, didError, property) {
  should.exist(data[property], `Expected property ${property} to exist`);
  data[property].should.be.an('object');
  data[property].should.have.property('error');
  data[property].error.should.be.a('string');
  data[property].error.should.equal(didError);
}
