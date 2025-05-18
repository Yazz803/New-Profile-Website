import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content Profile Website")
    .items([
      S.documentTypeListItem("profile").title("Profiles"),
      S.documentTypeListItem("job").title("Jobs"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("heroe").title("Heroes"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["post", "author", "profile", "job", "project", "heroe"].includes(
            item.getId()!
          )
      ),
    ]);
