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
  data.should.have.property('didResolutionMetadata');
};

export const shouldErrorWithData = (response, error) => {
  should.not.exist(response, 'Expected no response');
  should.exist(error, 'Expected an error');
  should.exist(error.data, 'Expected an error with data');
};
