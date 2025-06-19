# FUSE Project: Information Ontology and Architecture

## 1. Project Overview

The FUSE Project viewer is an interactive web application designed to visualize and navigate a collection of documents or "files" organized within a conceptual genomic metaphor. It presents data through a "karyotype" view of macro-structures (chromosomes) and codon groups (bands), allowing users to explore related files listed in a "codon spool."

## 2. Core Data Files

The viewer relies on two primary JSON files to populate its content:

### A. `project_ontology.json`

This file defines the primary structure of the project, relationships between conceptual entities, and associated metadata.

-   **Purpose**: To establish the hierarchical organization of files, their grouping into macro-structures and codon groups, display order, and visual cues like colors.
-   **Key Top-Level Fields**:
    -   `files`: An object where each key is a unique `file_id` (e.g., "F001", "SF002"). The value for each `file_id` is an object containing:
        -   `macro_structure` (string): The top-level category this file belongs to (e.g., "TECHNOLOGY", "ECONOMY"). Visualized as a chromosome.
        -   `codon_group` (string): The sub-category within the `macro_structure` (e.g., "Digital Sovereignty", "Platform Capitalism"). Visualized as a band on a chromosome.
        -   `url` (string): The URL to the actual document/resource.
        -   `note` (string, optional): A short descriptive note or sub-title for the file, displayed in the codon spool.
        -   `keywords` (array of strings, optional): Relevant keywords for potential future search/filtering functionality.
    -   `macro_structures_order`: An array of strings. Defines the sequence in which macro-structures (chromosomes) are displayed in the karyotype panel.
    -   `codon_groups_order`: An object. 
        -   Keys: `macro_structure` names (must match those in `macro_structures_order` and used in `files`).
        -   Values: Arrays of `codon_group` names. Defines the order of bands within each corresponding chromosome stick.
    -   `color_map`: An object.
        -   Keys: `codon_group` names.
        -   Values: CSS color strings (e.g., "#ff0000", "rgb(0,255,0)"). Defines the specific color for each chromosome band representing that codon group. If a codon group is not in this map, a fallback pastel color is used.

### B. `file_titles.json`

This file provides human-readable titles for the files defined in `project_ontology.json`.

-   **Purpose**: To map `file_id`s to user-friendly titles displayed in the codon spool.
-   **Structure**: An object where keys are `file_id`s (matching those in `project_ontology.json`) and values are the corresponding title strings.

## 3. Information Architecture of the Viewer (`ip-flex-02.html`)

The viewer dynamically constructs its UI based on the data from the JSON files.

-   **Main Project Title**: Static text: "The FUSE Project (FU)", displayed at the top (or top-left on wider screens).

-   **Karyotype Panel** (Left column on wide screens, top section on mobile):
    -   Displays a series of vertical "chromosome sticks."
    -   Each stick represents a `macro_structure` from `project_ontology.json`, ordered according to `macro_structures_order`.
    -   **Chromosome Label**: A single, large capital letter derived from the first letter of the `macro_structure` name (e.g., "T" for "TECHNOLOGY").
    -   **Chromosome Bands**:
        -   Segments on each chromosome stick, representing `codon_groups` associated with that `macro_structure`.
        -   Ordered according to the `codon_groups_order` array for the current `macro_structure`.
        -   **Color**: Determined by looking up the `codon_group` in the `color_map`. If not found, a default pastel color from a predefined CSS variable set is used.
        -   **Size (Height)**: Proportional to the number of files within that `codon_group` for the specific `macro_structure`.
        -   **Interaction**: Clickable and focusable. Hovering/focusing shows a tooltip.
        -   **Tooltip (on band hover/focus)**: Displays the full `codon_group` name and the count of files it contains for that macro-structure.

-   **Codon Spool Panel** (Right column on wide screens, bottom section on mobile):
    -   **Header**: 
        -   Displays the name of the currently selected `codon_group`.
        -   The background color of this header dynamically changes to match the color of the selected chromosome band.
        -   Text color adjusts for contrast against the dynamic background.
    -   **Sub-header**: Static text: "AMINO ACID".
    -   **File List**: 
        -   Populated when a chromosome band is clicked.
        -   Lists all files from `project_ontology.json` that belong to the selected `macro_structure` AND the selected `codon_group`.
        -   Each item in the list is an `<a>` tag, linking to the `url` specified for the file.
        -   **File Title**: The primary display text for each file. Fetched from `file_titles.json` using the `file_id`. If a `file_id` is not found in `file_titles.json`, the `file_id` itself is displayed as a fallback.
        -   **File Note** (optional): If a `note` is provided for the file in `project_ontology.json`, it's displayed beneath the file title.
        -   **Tooltip (on file item hover/focus)**: Shows the `file_id`.

-   **Data Flow Summary**:
    1.  Asynchronously fetch `project_ontology.json` and `file_titles.json`.
    2.  Validate the schema of `project_ontology.json`. Report errors via the status banner.
    3.  Process `project_ontology.json` to create an internal data structure (referred to as `CORPUS` in the code). This involves:
        -   Grouping files by their `macro_structure` and `codon_group`.
        -   Calculating file counts per group for band sizing.
    4.  Render the Karyotype Panel using the processed `CORPUS` data and the `macro_structures_order`.
    5.  When a chromosome band is clicked:
        -   The Codon Spool Panel's header is updated with the selected `codon_group` name and its color.
        -   The file list in the Codon Spool is populated with relevant files, using titles from `file_titles.json`.

-   **Status Banner**: An absolutely positioned banner at the top of the screen (or top of the archive container on wide screens) displays loading status, fetch errors, or schema validation errors.

## 4. Key Identifiers and Relationships

-   `file_id`: The central unique identifier for a document/resource. It links entries in the `files` object of `project_ontology.json` to their corresponding titles in `file_titles.json`.
-   `macro_structure`: The highest-level organizational category. Files are grouped under these, and they are visualized as the main chromosome sticks.
-   `codon_group`: A sub-category within a `macro_structure`. Files are further grouped by these, visualized as colored bands on the chromosome sticks. Selection of a band filters the files shown in the Codon Spool.

## 5. Styling and UI Philosophy

-   **Aesthetic**: Adopts a "manila folder" theme with pastel colors for default bands, aiming for a retro-technical but clean interface.
-   **Fonts**: Uses "Share Tech Mono" for main text and "Teko" for display/header text.
-   **Responsiveness**: Designed to work on both desktop and mobile devices.
    -   Desktop: Typically a two-column layout (Project Title on the left, Karyotype/Codon Spool on the right).
    -   Mobile: Stacks elements vertically (Project Title, then Karyotype, then Codon Spool).
-   **Accessibility**: Incorporates ARIA roles and keyboard navigation for interactive elements.
