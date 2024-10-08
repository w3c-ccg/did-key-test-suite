# did:key Method Interoperability Test Suite

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Test Data](#test-data)
- [Implementation](#implementation)


## Background

Provides interoperability tests for did resolvers that support
[`did:key` Method](https://w3c-ccg.github.io/did-method-key/).

## Install

```sh
$ npm i
```

## Usage

```sh
$ npm test
```

## Test Data
Currently our test suite works only with `did:key`s that are `ed25519`
compatible.  We will expand to support other formats of `did:key` when those
libraries are available.

## Implementation
To add your implementation to this test suite see the
[README here.](https://github.com/w3c-ccg/vc-test-suite-implementations)
Add the tag `did-key` to the did resolvers you want tested. Did Resolvers should
be their own property in the JSON manifest:

```js
  "issuers": [{
    // ... issuer settings here
  }],
  "verifiers": [{
    // ... verifier settings here
  }],
  "didResolvers": [{
    "id": "",
    "endpoint": "https://did.resolver.my.app/1.0/resolve/identifiers",
    "tags": ["did-key"]
  }]
```

To run the tests, some implementations require client secrets that can be passed
as env variables to the test script. To see which ones require client secrets,
you can check the
[vc-test-suite-implementations](https://github.com/w3c-ccg/vc-test-suite-implementations)
library.

## LICENSE

[BSD-3-Clause](LICENSE) Copyright 2022-2024 Digital Bazaar, Inc.
