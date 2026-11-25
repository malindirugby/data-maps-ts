# data-maps-ts

A TypeScript package for describing canonical data entities, attributes, relationships, validation, classification, and usage policies independently of any interface layer.

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
