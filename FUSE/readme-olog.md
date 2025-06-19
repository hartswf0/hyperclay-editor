# FUSE Project: Genetic Information Ontology Model (Olog)

This document outlines the information ontology of the FUSE project using a simplified Olog (Ontology Log) structure. This model is inspired by Spencer-Brown's calculus of indications, providing a structured index of entities, morphisms, and their relationships.

-   `◻` (Square) denotes a **Distinction** or **Type** (an entity or category of thing).
-   `→` (Arrow) denotes an **Indication** or **Morphism** (a relationship, aspect, or function between types).

## I. Types (Distinctions ◻)

These are the fundamental entities or categories of information within the FUSE project's genetic metaphor:

1.  `◻ File`: Represents an individual document or resource, the basic unit of information.
2.  `◻ FileID`: A unique string identifier for a `◻ File` (e.g., "F001", "SF002").
3.  `◻ URL`: The Uniform Resource Locator providing access to the content of a `◻ File`.
4.  `◻ Note`: An optional textual annotation or sub-title associated with a `◻ File`.
5.  `◻ Keyword`: An optional descriptive term or tag associated with a `◻ File` for classification or search.
6.  `◻ Title`: The human-readable name or title of a `◻ File`, typically sourced from `file_titles.json`.
7.  `◻ MacroStructure`: A primary, high-level conceptual category used to organize `◻ File`s (visualized as a "chromosome").
8.  `◻ MacroStructureName`: The textual name identifying a `◻ MacroStructure` (e.g., "TECHNOLOGY", "ECONOMY").
9.  `◻ CodonGroup`: A secondary, more specific conceptual category within a `◻ MacroStructure` (visualized as a "band" on a chromosome).
10. `◻ CodonGroupName`: The textual name identifying a `◻ CodonGroup` (e.g., "Digital Sovereignty", "Platform Capitalism").
11. `◻ Color`: A visual color representation (CSS string) associated with a `◻ CodonGroup` for its band display.
12. `◻ DisplayOrder`: An abstract concept representing a sequential position or rank, used for ordering `◻ MacroStructure`s and `◻ CodonGroup`s.

## II. Aspects/Paths (Morphisms/Indications →)

These define the relationships and mappings between the Types, forming the structure of the information:

1.  `◻ File` → `is_identified_by` → `◻ FileID`
    *   *Description: A File is uniquely identified by a FileID.*
2.  `◻ FileID` → `references_file` → `◻ File`
    *   *Description: A FileID refers to a specific File (this is the inverse of `is_identified_by`).*
3.  `◻ File` → `is_located_at` → `◻ URL`
    *   *Description: A File can be accessed via a URL.*
4.  `◻ File` → `may_be_annotated_with` → `◻ Note`
    *   *Description: A File can optionally have an associated Note.*
5.  `◻ File` → `may_be_tagged_with` → `◻ Keyword`
    *   *Description: A File can optionally be associated with one or more Keywords.*
6.  `◻ FileID` → `is_titled_as` → `◻ Title`
    *   *Description: A FileID is associated with a human-readable Title (this morphism typically links data from `project_ontology.json` to `file_titles.json`).*
7.  `◻ File` → `belongs_to_category` → `◻ MacroStructure`
    *   *Description: A File is classified under a primary MacroStructure.*
8.  `◻ File` → `belongs_to_subcategory` → `◻ CodonGroup`
    *   *Description: A File is further classified under a secondary CodonGroup, which is itself part of a MacroStructure.*
9.  `◻ MacroStructure` → `is_named` → `◻ MacroStructureName`
    *   *Description: A MacroStructure has a defining textual name.*
10. `◻ MacroStructure` → `has_overall_display_order` → `◻ DisplayOrder`
    *   *Description: MacroStructures are displayed in the karyotype panel according to a specific sequence (derived from `macro_structures_order`).*
11. `◻ MacroStructure` → `contains_group` → `◻ CodonGroup`
    *   *Description: A MacroStructure encompasses one or more CodonGroups.*
12. `◻ CodonGroup` → `is_named` → `◻ CodonGroupName`
    *   *Description: A CodonGroup has a defining textual name.*
13. `◻ CodonGroup` → `is_part_of` → `◻ MacroStructure`
    *   *Description: A CodonGroup is a component of, and contextualized by, a specific MacroStructure.*
14. `◻ CodonGroup` → `has_internal_display_order` → `◻ DisplayOrder`
    *   *Description: CodonGroups within a particular MacroStructure are displayed as bands in a specific sequence (derived from `codon_groups_order`).*
15. `◻ CodonGroup` → `is_visualized_with_color` → `◻ Color`
    *   *Description: A CodonGroup is associated with a specific display Color for its band in the karyotype (from `color_map` or a default).*

## III. Olog Interpretation Notes

-   This Olog represents the **schema** or **conceptual model** of the information within the FUSE project viewer.
-   Actual data consists of **instances** of these Types (e.g., a specific `◻ File` instance like "F001", a `◻ MacroStructure` instance named "TECHNOLOGY").
-   The relationships (morphisms) define how these instances are interconnected and how the application logic navigates, processes, and presents the data.
-   The term "genetic information ontology" refers to the structure of information organized and visualized through the project's **genomic metaphor** (chromosomes, bands, codons), while the underlying entities are documents, conceptual categories, and their associated metadata.
