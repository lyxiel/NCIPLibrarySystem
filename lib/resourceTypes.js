// Centralized resource types and classification mapping
export const resourceTypes = [
  'Book',
  'Monograph',
  'Article',
  'Research Paper',
  'Case Study',
  'Thesis',
  'Newspaper',
  'Magazine',
  'Report',
  'Journal',
  'Audio',
  'Video',
  'Module',
  'Electronic Resources',
  'Compilation',
  'Brochure / Flyer',
  'Printed Powerpoint',
  'IKSP/CL',
  'Map',
  'Other',
]

// Map resource types to broader classification categories used in the UI
const typeToClassification = {
  Book: 'Monograph',
  Monograph: 'Monograph',
  Article: 'Article',
  'Research Paper': 'Article',
  'Case Study': 'Case Study',
  Thesis: 'Thesis',
  Newspaper: 'Periodical',
  Magazine: 'Periodical',
  Report: 'Report',
  Journal: 'Article',
  Audio: 'Audio',
  Video: 'Audio-Visual',
  Module: 'Module',
  'Electronic Resources': 'Electronic',
  Compilation: 'Compilation',
  'Brochure / Flyer': 'Brochure / Flyer',
  'Printed Powerpoint': 'Printed Powerpoint',
  'IKSP/CL': 'IKSP/CL',
  Map: 'Map',
  Other: 'Other',
}

export function classify(resourceType) {
  if (!resourceType) return 'Unclassified'
  const t = String(resourceType).trim()
  return typeToClassification[t] || 'Unclassified'
}

export const classificationCategories = ['All', ...Array.from(new Set(Object.values(typeToClassification))).sort()]

export default {
  resourceTypes,
  classificationCategories,
  classify,
}
