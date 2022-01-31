/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const httpsAgent = new https.Agent({rejectUnauthorized: false});
const {httpClient} = require('@digitalbazaar/http-client');

const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  /**
   * An https did resolver binding.
   *
   * @param {object} options - Options to use.
   * @param {String} options.did - A did.
   * @param {object} [options.auth] - Potential auth credentials
   *   for the did resolver.
   *
   * @returns {Promise<object>} The result from the did resolver.
   */
  async didResolver({did, auth}) {
    const headers = {..._headers};
    if(auth && auth.type === 'oauth2-bearer-token') {
      headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return httpClient.get(
      `${this.settings.didResolver}/${encodeURIComponent(did)}`,
      {headers, httpsAgent}
    );
  }
}

module.exports = Implementation;
