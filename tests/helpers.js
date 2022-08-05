/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Using a colon (:) as the delimiter, split the identifier
 * into its components: a scheme, a method, a version, and a
 * multibaseValue. If there are only three components set the
 * version to the string value 1 and use the last value as
 * the multibaseValue.
 *
 * @param {object} options - Options to use.
 * @param {string} options.did - A did as a string.
 *
 * @returns {object} The parts of the did.
*/
export const splitDid = ({did}) => {
  const parts = did.split(':');
  // multibase maybe undefined
  const [scheme, method, version, multibase] = parts;
  return {
    scheme,
    method,
    // if multibase exists use the version
    version: multibase ? version : '1',
    // if multibase exists use multibase
    multibase: multibase || version,
    parts,
    did
  };
};
