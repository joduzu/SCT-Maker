# Advanced SCT Tool Builder

**Author:** [Jorge Durand Zurdo](mailto:joduzu@gmail.com)  
**File:** `index_codex_final_6_pdf.html`  
**Purpose:** Interactive HTML/JS application for creating, customizing, and exporting Specialized Care Team (SCT) self-assessment tools aligned with WHO EMT classification and verification processes.

---

## Overview

The **Advanced SCT Tool Builder** allows mentors, verifiers, and technical focal points to design dynamic SCT self-assessment tools.  
It integrates technical standards, deployment modalities (Embedded / Coupled / Self-Sustained), and editable guidance under a single interactive interface.  
The generated output is a fully functional HTML tool that works offline and can be hosted online.

---

## Main Functionalities

### 1. Deployment Modalities Configuration
- Select one or more deployment modes:
  - Embedded  
  - Coupled  
  - Self-Sustained
- Each mode includes prefilled requirements and mitigation strategies for:
  - Core Standards  
  - Logistics  
  - Clinical Standards  
  - WASH
- Each modality section is editable, allowing contextual adjustments.

### 2. Section Builder and Weight Distribution
- Sections included by default:
  - INFO, DEFINITION, ORGANIZATIONAL DETAIL  
  - GUIDING PRINCIPLES, CORE STANDARDS, CLINICAL STANDARDS  
  - LOGISTIC STANDARDS, WASH STANDARDS, SUMMARY
- Each section can be:
  - Enabled or disabled  
  - Assigned a percentage weight (total must equal 100%)

### 3. Rich Text Editor for Standards
- Built-in WYSIWYG editor with:
  - Bold, Italic, Underline
  - Bullet and numbered lists
  - Clear formatting
- Each standard includes:
  - Editable title and content  
  - Linked Deployment Prefill Editor per modality

### 4. Dynamic Subsection Management
- Add, rename, or delete standards under any section.
- Automatic title detection and synchronization.
- Each subsection includes:
  - Content editor  
  - Modality-specific requirements and mitigations

### 5. Deployment Prefill Editors
- Collapsible editors per modality:
  - Requirements: operational prerequisites  
  - Mitigations: fallback strategies
- Preloaded with WHO EMT guidance and fully editable.

### 6. Generate Complete HTML Tool
- One-click generation of a portable, standalone SCT self-assessment tool.
- Output includes:
  - Section weights
  - Custom standards
  - Modality-specific deployment guidance
  - Fully interactive navigation and layout

---

## Technical Architecture

| Component | Description |
|------------|-------------|
| `DEPLOYMENT_MODALITIES` | Defines modality metadata (labels, icons, styles) |
| `DEPLOYMENT_MODALITY_DETAILS` | Stores requirements and mitigations for each modality |
| `TOOL_CONFIG` | Base configuration for all sections and subsections |
| `builderDeploymentOverrides` | Captures user edits to modality data |
| `generateHTML()` | Builds the final compiled HTML output |
| `addSubsectionItem()` | Creates new editable standards dynamically |
| `setupRichTextEditors()` | Initializes WYSIWYG editing and toolbar actions |
| `updateWeightSum()` | Validates section weights in real time |

---

## Output

The exported HTML file includes:
- Section tabs and navigation sidebar  
- Deployment summary banner  
- Editable requirement and mitigation cards  
- All dependencies embedded (Bootstrap, Font Awesome, XLSX.js)

The tool is fully operational offline and can be shared or hosted directly.

---

## Hosting and Export Options

### Option 1 — Local Use
1. Open `index_codex_final_6_pdf.html` in a browser.  
2. Configure and click **Generate Complete HTML Tool**.  
3. Save the generated output as a new `.html` file.  
4. Works entirely offline.

### Option 2 — GitHub Pages
1. Create a GitHub repository (e.g. `sct-tool-builder`).  
2. Upload `index_codex_final_6_pdf.html`.  
3. Enable **Pages** under repository Settings → Pages → Branch: `main` → `/root`.  
4. Access the hosted tool at `https://<username>.github.io/sct-tool-builder`.

### Option 3 — WHO / Institutional SharePoint
1. Upload the HTML file to a document library.  
2. Enable “open in browser” for HTML files.  
3. Share the direct URL with users.  

---

## Data and Compatibility Notes
- Fully client-side, no server or database required.  
- Works in modern browsers (Chrome, Edge, Firefox).  
- Offline-capable after first load.  
- Uses Bootstrap 5, Font Awesome 6, and XLSX.js (CDN-loaded).

---

## Typical Workflow Example

| Step | Action |
|------|---------|
| 1 | Enter SCT name (e.g., "Burns SCT"). |
| 2 | Select deployment modalities (Embedded, Coupled, etc.). |
| 3 | Adjust section weights. |
| 4 | Add or edit standards. |
| 5 | Customize requirements and mitigations. |
| 6 | Click **Generate Complete HTML Tool** and save the result. |

---

## License
Internal WHO/EMT use – draft tool for methodological and training purposes.  
Redistribution allowed for humanitarian or academic use with attribution.

