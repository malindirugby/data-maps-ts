# data-maps-ts

A TypeScript package for describing canonical data entities, attributes, relationships, validation, classification, and usage policies independently of any interface layer.

## Install from GitHub Packages

Configure the `@malindirugby` scope to use GitHub Packages in the consuming application's `.npmrc`:

```ini
@malindirugby:registry=https://npm.pkg.github.com
```

Authenticate to GitHub Packages with a token that has permission to read this package. Keep credentials in the user's or CI environment's npm configuration; never commit a token.

Then install:

```bash
npm install @malindirugby/data-maps-ts
```

## Usage

```ts
import { PersonDefinition } from "@malindirugby/data-maps-ts";

console.log(PersonDefinition.name);
console.log(PersonDefinition.attributes.email.label);
```

## Development

Requires Node.js 20 or newer.

```bash
npm ci
npm run check
npm test
npm run build
```

The package is published to GitHub Packages only (`https://npm.pkg.github.com`). It is not configured for the public npm registry.
