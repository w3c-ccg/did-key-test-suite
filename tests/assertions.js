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
export const testResolverResponse = data => {
  should.exist(data, 'expected data to exist');
  data.should.be.an('object');
  data.should.have.property('didDocument');
  data.should.have.property('@context');
  data.should.have.property('didDocumentMetadata');
  data.should.have.property('didResolutionMetadata');
};
