# GENOMA Suite

## Overview

The GENOMA Suite is an experimental, web-based 'digital genetics lab' for information synthesis. It allows users to create, manipulate, and visualize 'genomes' composed of modular data units called 'codons.'

This project moves beyond traditional document editors, treating information as a dynamic, evolvable entity. Users can structure data using various codon types (text, links, media), reorder them, and export the resulting 'phenotype' (the expressed genome).

## Features

- **Genome Library:** Manage multiple named genomes.
- **Codon-based Editor:** Add, delete, duplicate, and reorder codons in a sequence.
- **Drag-and-Drop:** Intuitively reorder codons within the genome strand.
- **Undo/Redo:** Full history management for all structural changes.
- **Codon Palette:** A modal for easily adding new codons of different types (Text, Image, Link, etc.).
- **Intron/Exon Toggling:** Mark codons as 'introns' to exclude them from the final output without deleting them.
- **Import/Export:** Save and load entire genomes as JSON files.
- **Phenotype Viewer:** See the real-time rendered output of your genome.

## How to Run

1.  Ensure you have Python 3 installed.
2.  From the project's root directory, run a simple local web server:
    ```bash
    python3 -m http.server
    ```
3.  Open your web browser and navigate to `http://localhost:8000/gs2.html` (or any other `.html` file in the suite).
