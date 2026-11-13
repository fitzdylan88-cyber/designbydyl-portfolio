import type { SchemaTypeDefinition } from "sanity";
import { richText, simpleText } from "./text";
import {
  beforeAfterSection,
  calloutSection,
  imageRowSection,
  imageSection,
  metric,
  metricsSection,
  noteSection,
  picture,
  promptSection,
  shortVersionSection,
  textImageSection,
  textSection,
} from "./sections";
import { caseStudy } from "./case-study";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    caseStudy,
    richText,
    simpleText,
    picture,
    metric,
    textSection,
    textImageSection,
    imageSection,
    imageRowSection,
    calloutSection,
    metricsSection,
    beforeAfterSection,
    promptSection,
    noteSection,
    shortVersionSection,
  ],
};
