import type { StructureResolver } from "sanity/structure";

/** Sidebar: one list per section of the site, newest-first within the site order. */
const lists = [
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects" },
  { id: "play", title: "Play" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items(
      lists.map(({ id, title }) =>
        S.listItem()
          .id(id)
          .title(title)
          .child(
            S.documentTypeList("caseStudy")
              .title(title)
              .filter('_type == "caseStudy" && collection == $collection')
              .params({ collection: id })
              .defaultOrdering([
                { field: "order", direction: "asc" },
                { field: "date", direction: "desc" },
              ])
              .initialValueTemplates([S.initialValueTemplateItem("caseStudy-in", { collection: id })]),
          ),
      ),
    );
