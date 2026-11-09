/** Defines the identifying fields for a geographic location. */
export const locationDefinition = {
  id: "location",
  version: "1.0.0",
  name: "Location",
  description: "A place or geographic area represented in the map.",
  attributes: {
    name: {
      type: "string",
      label: "Location name",
      required: true,
      validation: { minLength: 1 },
    },
    countryCode: {
      type: "string",
      label: "Country code",
      required: false,
      validation: { minLength: 2, maxLength: 2 },
    },
  },
};
