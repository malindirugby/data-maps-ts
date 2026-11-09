# Data Map

This repository is a TypeScript data definition package for describing entities, attributes, relationships, validation, and usage policy independently of any interface layer.

The package focuses on the canonical meaning of data rather than on collection experience or presentation details.

## Core model

- Entity definitions with versioned metadata
- Typed attributes and validation constraints
- Relationship definitions between domains
- Policy layers for validation, classification, and usage
- Registry utilities to expose available definitions

## Example

```ts
import { PersonDefinition } from "./src/domains/people";

console.log(PersonDefinition.name);
console.log(PersonDefinition.attributes.email.label);
```

This package is intentionally independent of UI or form rendering concerns.
