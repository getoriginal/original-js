# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.2](https://github.com/getoriginal/original-js/compare/v1.3.1...v1.3.2) (2024-05-22)


### Bug Fixes

* (ori-2666) - remove client_id, make asset_external_id required ([7a095b7](https://github.com/getoriginal/original-js/commit/7a095b745237972cb9956a84d9e1c3dbc6fa46c6))
* **ORI-2607:** Update readme get asset apis image_url -> image ([3a3ed14](https://github.com/getoriginal/original-js/commit/3a3ed14891eacf40d3127444b09a9b0b68220f9b))

## [1.3.1](https://github.com/getoriginal/original-js/compare/v1.3.0...v1.4.0) (2024-05-08)


### Features

* add support for mint price ([#41](https://github.com/getoriginal/original-js/issues/41)) ([39ee5b2](https://github.com/getoriginal/original-js/commit/39ee5b2a0bcc1f7ec646fdab988949e864191a27))


### Bug Fixes

* move chain logic to env and reuse some env vars in e2e tests ([#40](https://github.com/getoriginal/original-js/issues/40)) ([0a022c2](https://github.com/getoriginal/original-js/commit/0a022c2105dce0986526dec5ff4bbd44d07fa9ba))

## [1.3.0](https://github.com/getoriginal/original-js/compare/v1.2.3...v1.3.0) (2024-04-02)


### Features

* **ORI-1755:** add reward methods ([019dd04](https://github.com/getoriginal/original-js/commit/019dd0443664293f378421503e35dea96c88d682))


### [1.2.3](https://github.com/getoriginal/original-js/compare/v1.2.2...v1.2.3) (2024-03-12)


### Bug Fixes

* **ORI-2200:** add external ids to user and asset and deprecate client_id ([3b61540](https://github.com/getoriginal/original-js/commit/3b61540cf54a82ce76969ce032e1528b8d8b26e6))


### [1.2.2](https://github.com/getoriginal/original-js/compare/v1.2.1...v1.2.2) (2024-03-08)


### Bug Fixes

* **1831:** align sdk readme with documentation ([9f13bff](https://github.com/getoriginal/original-js/commit/9f13bff995bd6cc5d67c2bd74b979a39910d6df1))
* Allow client_id to be optional when creating a user ([e47f295](https://github.com/getoriginal/original-js/commit/e47f2956b619f75ce0f4888d38df79cccbba193c))
* **ORI-2191:** Make client_id optional, add missing metadata params ([9de9dbc](https://github.com/getoriginal/original-js/commit/9de9dbcab1c09a50d733ef32c43f9e755e635a04))

### [1.2.1](https://github.com/getoriginal/original-js/compare/v1.2.0...v1.2.1) (2024-02-16)


### Bug Fixes

* Add specific error classes for the types of errors we can receive ([60dbac5](https://github.com/getoriginal/original-js/commit/60dbac508f1ed764b8d6305d33fd1904ce9e4c5c))
* Fallback to throwing a client error ([04a3299](https://github.com/getoriginal/original-js/commit/04a3299754277295468bff383f8c30beff9f28f2))


## [1.2.0](https://github.com/getoriginal/original-js/compare/v1.1.6...v1.2.0) (2024-02-13)


### Features

* [ORI-1880] Add development environment and URL ([ea7193f](https://github.com/getoriginal/original-js/commit/ea7193f408804331d8872dde95f37f45e8680a5c))

### [1.1.6](https://github.com/getoriginal/original-js/compare/v1.1.5...v1.1.6) (2024-02-08)


### Bug Fixes

* [ORI-1869] fix up parsing on error responses ([#20](https://github.com/getoriginal/original-js/issues/20)) ([b5f1a80](https://github.com/getoriginal/original-js/commit/b5f1a80af2e381db0df718b4f9486704a848bfd3))
* [ORI-1872] export alias OriginalClient with backwards compatibility to Original, to sync naming convention across sdks ([#21](https://github.com/getoriginal/original-js/issues/21)) ([dd9c4fa](https://github.com/getoriginal/original-js/commit/dd9c4faa0b3c53321aa248d2f0b9932ee77d3f55))

### [1.1.5](https://github.com/getoriginal/original-js/compare/v1.1.4...v1.1.5) (2024-01-15)


### Bug Fixes

* [readMe] update read me to include depo ([#18](https://github.com/getoriginal/original-js/issues/18)) ([88e16e6](https://github.com/getoriginal/original-js/commit/88e16e6210497017c3b8e11175288d1c4f567585))

### [1.1.4](https://github.com/getoriginal/original-js/compare/v1.1.3...v1.1.4) (2024-01-15)


### Bug Fixes

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
