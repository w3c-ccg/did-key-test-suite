/*!
 * Copyright (c) 2022 Dogwood Logic, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
require('bedrock-server');

// server info
config.server.port = 17443;
config.server.httpPort = 17080;
config.server.domain = 'localhost';
