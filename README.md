# did:key Method Interoperability Test Suite

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Test Data](#testdata)
- [Implementation](#implementation)


## Background

Provides interoperability tests for did resolvers that support [did:key Method](https://w3c-ccg.github.io/did-method-key/).

## Install

```js
npm i
```

## Usage

```
npm test
```

## Test Data

To generate new Dids simply add them to the `/dids` directory.

```js
{
  "negative": false,
  "did": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b",
  "row": "should return a didDocument for a valid DID",
  "title": "should return a didDocument for a valid DID",
  "expected": {
    "status": 200,
    "didDocument": {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
        "https://w3id.org/security/suites/x25519-2020/v1"
      ],
      "id": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b",
      "verificationMethod": [
        {
          "id": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b",
          "type": "Ed25519VerificationKey2020",
          "controller": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b",
          "publicKeyMultibase": "z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b"
        }
      ],
      "authentication": [
        "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b"
      ],
      "assertionMethod": [
        "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b"
      ],
      "capabilityDelegation": [
        "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b"
      ],
      "capabilityInvocation": [
        "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b"
      ],
      "keyAgreement": [
        {
          "id": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6LSfHfAMAopsuBxaBzvp51GXrPf38Az13j2fmwqadbwwrzJ",
          "type": "X25519KeyAgreementKey2020",
          "controller": "did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b",
          "publicKeyMultibase": "z6LSfHfAMAopsuBxaBzvp51GXrPf38Az13j2fmwqadbwwrzJ"
        }
      ]
    }
  }
}
```


## Implementation

To add a new Implementation simply add a new file to the `/implementations` dir.

```js
{
  "name": "Your Company Name",
  "implementation": "Your Implementation Name",
  "issuer": {
    "id": "did:your-did-method:your-did-id",
    "endpoint": "https://your-company.com/vc-issuer/issue",
    "headers": {
      "authorization": "Bearer your auth token"
    }
  },
  "verifier": "https://your-company.com/vc-verifier/verify",
  "didResolver": "https://resolver.your-company.com/1.0/identifiers"
}
```

You will also need to whitelist the implementation in `tests/01-interop.js`.

```js
// test these implementations' issuers or verifiers
const test = [
  'Your Company Name'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));
```
