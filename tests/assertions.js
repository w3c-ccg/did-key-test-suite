/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';

const should = chai.should();

/**
 * Tests the properties of a did resolver result.
 *
 * @param {object} result - The result from a did resolver.
 *
 * @returns {undefined} Just returns on success.
 */
export const testResolverResponse = result => {
  should.exist(result, 'expected result to exist');
  result.should.be.an('object');
  result.should.have.property('didDocument');
};
