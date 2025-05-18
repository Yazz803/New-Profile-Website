import { type SchemaTypeDefinition } from "sanity";

import blockContentType from "./blockContentType";
import postType from "./postType";
import authorType from "./authorType";
import { youtube } from "./youtube";
import { table } from "./table";
import quiz from "./quiz";
import job from "./job";
import profile from "./profile";
import project from "./project";
import heroe from "./heroe";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    job,
    project,
    postType,
    authorType,
    heroe,

    // Reference types
    blockContentType,
    youtube,
    table,
    quiz,
  ],
};
