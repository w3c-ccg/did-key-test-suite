/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');

const should = chai.should();

/**
 * Tests the properties of a did resolver result.
 *
 * @param {object} result - The result from a did resolver.
 *
 * @returns {undefined} Just returns on success.
 */
const testResolverResponse = result => {
  should.exist(result, 'expected result to exist');
  result.should.be.an('object');
  result.should.have.property('didDocument');
};

module.exports = {testResolverResponse};
