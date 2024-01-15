# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.4](https://github.com/getoriginal/original-js/compare/v1.1.3...v1.1.4) (2024-01-15)


### Bug Fixes

* [ORI-1665] Cleanup comments, todos ([8dd23d1](https://github.com/getoriginal/original-js/commit/8dd23d15a95dca0466d41d0d6c59503881388839))
* [ORI-1665] Fix production endpoint, and remove option for sandbox. Update e2e tests to match changes to acceptance from move to gcp ([78eaad3](https://github.com/getoriginal/original-js/commit/78eaad3b0addb099e29861682fad5df407a0ea9b))
* [ORI-1671] Add method getDeposit, which exposes the deposit endpoint ([586b36c](https://github.com/getoriginal/original-js/commit/586b36c3df68b1acb42df633ce9d25c9f7fc05bd))
* [ORI-1671] pr review, naming ([beb1c62](https://github.com/getoriginal/original-js/commit/beb1c623133eb932e6a506a30d66bf1d4cca29b7))

### [1.1.3](https://github.com/getoriginal/original-js/compare/v1.1.2...v1.1.3) (2023-11-13)


### Bug Fixes

* display type on assetData attributes is optional ([1d093b3](https://github.com/getoriginal/original-js/commit/1d093b391ef01b319c1a63d722462b86e592d179))

### [1.1.2](https://github.com/getoriginal/original-js/compare/v1.1.1...v1.1.2) (2023-11-12)


### Bug Fixes

* [ORI-1381] fix uid return type to {uid: string}. Fix return type of editAsset (only returns success status) ([30fbf65](https://github.com/getoriginal/original-js/commit/30fbf65c07d1e32ef5a4960aa482f3eccbbdbf56))
* cleanup return types on get...ByUserId, minor cleanups on method doc strings ([a335dcc](https://github.com/getoriginal/original-js/commit/a335dcca8308e0a675295a6154158aec1348a4cb))
* get rid of ApiSearchResponse type and use ApiResponse type throughout class. ([91f57e4](https://github.com/getoriginal/original-js/commit/91f57e4794d7cc96284ef956cdc2be3163e444d1))
* README add link to original docs ([45c0b16](https://github.com/getoriginal/original-js/commit/45c0b163df2c392e73d97efa230904e29293c69e))
* README updates ([a6e889b](https://github.com/getoriginal/original-js/commit/a6e889b87c80f4b27731a7b67ea39206ff3bc191))
* refactor getAssetsByUserId to getAssetsByUserUid to be consistent with naming conventions. ([0808700](https://github.com/getoriginal/original-js/commit/0808700be21f55ffc84f223280008b13a7d462d1))

### [1.1.1](https://github.com/getoriginal/original-js/compare/v1.1.0...v1.1.1) (2023-11-03)


### Bug Fixes

* remove .idea files ([b6b13a6](https://github.com/getoriginal/original-js/commit/b6b13a61d676d41e4804c5835c16356732df0aca))

## 1.1.0 (2023-11-01)


### Features

* [ORI-1339] Adding editAsset method to the sdk. Updating tests and adding githb workflows. ([3382f11](https://github.com/getoriginal/original-js/commit/3382f11730223c6d2b8b82455d49cc6c950cd58a))


### Bug Fixes

* [ORI-1339] Adding test constants as environment variables ([b5869d1](https://github.com/getoriginal/original-js/commit/b5869d1ba3a6d7de4185f59d544ab76d23142be6))
* [ORI-1339] Adding test constants as environment variables ([75adf75](https://github.com/getoriginal/original-js/commit/75adf75fcddac3bdf61101a2c2f95f0e9e23b99c))
* [ORI-1339] PR review. ([bddc191](https://github.com/getoriginal/original-js/commit/bddc1917a9873b7f632ac7e617483a5a21ae4ffa))
* bump version ([c0f6ad7](https://github.com/getoriginal/original-js/commit/c0f6ad711847ca3290f9e28298ad58c930a93562))
* error in README.md getUserByClient id  not used in example ([eb67096](https://github.com/getoriginal/original-js/commit/eb67096f2cc3a309d840a451ed2523104615b9bc))
* Lint/reformat README.md ([9f11600](https://github.com/getoriginal/original-js/commit/9f1160068cb2dd24f2d3b49331373ce8b0adbef4))
* make private field `false` in package.json for release ([cf07267](https://github.com/getoriginal/original-js/commit/cf072678929245604f19785e4fddd7c9780bf5f3))
* release workflow ([ba54272](https://github.com/getoriginal/original-js/commit/ba5427252d2052769f98cfe244f483f106faab1c))

### 1.0.1 (2023-10-31)


### Features

* [ORI-1339] Adding editAsset method to the sdk. Updating tests and adding githb workflows. ([3382f11](https://github.com/getoriginal/original-js/commit/3382f11730223c6d2b8b82455d49cc6c950cd58a))


### Bug Fixes

* [ORI-1339] Adding test constants as environment variables ([b5869d1](https://github.com/getoriginal/original-js/commit/b5869d1ba3a6d7de4185f59d544ab76d23142be6))
* [ORI-1339] Adding test constants as environment variables ([75adf75](https://github.com/getoriginal/original-js/commit/75adf75fcddac3bdf61101a2c2f95f0e9e23b99c))
* [ORI-1339] PR review. ([bddc191](https://github.com/getoriginal/original-js/commit/bddc1917a9873b7f632ac7e617483a5a21ae4ffa))
* error in README.md getUserByClient id  not used in example ([eb67096](https://github.com/getoriginal/original-js/commit/eb67096f2cc3a309d840a451ed2523104615b9bc))
* Lint/reformat README.md ([9f11600](https://github.com/getoriginal/original-js/commit/9f1160068cb2dd24f2d3b49331373ce8b0adbef4))
* make private field `false` in package.json for release ([cf07267](https://github.com/getoriginal/original-js/commit/cf072678929245604f19785e4fddd7c9780bf5f3))
* release workflow ([ba54272](https://github.com/getoriginal/original-js/commit/ba5427252d2052769f98cfe244f483f106faab1c))

## 1.0.0 (2023-10-30) - [1.0.0] - Initial Release

## October 18 2023 - [0.1.0] - Repo Created and Setup
