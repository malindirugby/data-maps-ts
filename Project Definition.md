# Project Definition

This repository is the Data Map package. Its purpose is to define the canonical meaning of information independently of any interface layer or collection experience.

## 1. Overall architecture

### 1.1 Repository 1: Data Map

The Data Map is the canonical repository for information definition.

It owns:

- Entities and relationships
- Attributes and data types
- Validation rules
- Semantic meaning
- Usage rules
- Versioned definitions

This package is intentionally a domain-definition library, not a presentation or collection package.

### 1.2 Recommended package structure

```text
data-map/
├── src/
│   ├── core/
│   │   ├── primitives/
│   │   │   ├── string.ts
│   │   │   ├── number.ts
│   │   │   ├── boolean.ts
│   │   │   └── date.ts
│   │   ├── metadata/
│   │   │   ├── attribute.ts
│   │   │   ├── entity.ts
│   │   │   └── relationship.ts
│   │   └── identifiers.ts
│   ├── domains/
│   │   ├── people/
│   │   │   ├── person.types.ts
│   │   │   ├── person.schema.ts
│   │   │   ├── person.definition.ts
│   │   │   └── index.ts
│   │   ├── organizations/
│   │   ├── locations/
│   │   └── employment/
│   ├── relationships/
│   │   ├── person-organization.ts
│   │   └── person-location.ts
│   ├── policies/
│   │   ├── validation/
│   │   ├── classification/
│   │   └── usage/
│   ├── registry/
│   │   └── index.ts
│   └── index.ts
├── tests/
├── package.json
├── tsconfig.json
├── README.md
└── Project Definition.md
```

## 2. How data is defined

Each entity has attributes. Each attribute describes a single piece of information.

```ts
export const Person = {
  id: "person",
  version: "1.0.0",
  name: "Person",
  description: "An individual human being",
  attributes: {
    firstName: {
      type: "string",
      label: "First name",
      description: "The person's legal or preferred first name",
      required: true,
    },
    email: {
      type: "string",
      label: "Email address",
      required: true,
      validation: {
        format: "email",
      },
    },
    dateOfBirth: {
      type: "date",
      label: "Date of birth",
      required: false,
    },
  },
} as const;
```

The Data Map answers questions such as:

- What is this piece of data?
- What does it mean?
- What type of value does it accept?
- What constraints apply?
- What entity does it belong to?
- What other entities is it related to?
- How should the data be classified or used?

The Data Map does not define user-interface layout, field ordering, or presentation decisions.

## 3. Separate meaning, validation and presentation

A clean data model separates three layers:

| Layer | Responsibility | Example |
| --- | --- | --- |
| Data types | Structural definition | `email: string` |
| Validation | Rules governing valid values | Must be a valid email |
| Semantics | Meaning and usage | Contact information |

This package should support:

- classification
- sensitivity
- provenance
- retention guidance
- relationship metadata

Usage policy and presentation policy remain distinct concerns. A field can be classified as sensitive in the Data Map without implying any specific interface behaviour.

## 4. Versioning

Forms and downstream consumers should reference a specific Data Map version rather than automatically consume the latest version. Published definitions should preserve a stable snapshot for historical integrity.

## 5. Technologies

| Concern | Recommendation |
| --- | --- |
| Language | TypeScript |
| Package manager | npm or bun |
| Data validation | Zod |
| Version management | Changesets |
| Testing | Vitest |
| Build | TypeScript compiler |
| CI/CD | GitHub Actions |

## 6. Architectural guardrails

Avoid:

- putting UI configuration in the Data Map
- importing internal data-map implementation across the codebase
- treating TypeScript interfaces as the only runtime definition
- silently overriding canonical validation rules
- coupling the Data Map to a single consumer

The guiding principle is simple: the Data Map should exist as the source of truth for meaning, with consumers adapting to it rather than dictating it.

