export interface ValidationIssue {
  path: Array<string | number>;
  message: string;
}

interface SourceReference {
  id: string;
}

interface FigureReference {
  id: string;
}

interface ArtifactMarkerReference {
  id: string;
  sourceRefs: string[];
  x: number;
  y: number;
}

export interface StoryRelationshipData {
  format: "artist-portrait" | "scene-report" | "cover-story";
  hero: { id: string };
  figures: FigureReference[];
  sources: SourceReference[];
  artifact?: {
    type: "annotated-artifact";
    imageId: string;
    markers: ArtifactMarkerReference[];
  };
}

export function validateStoryRelationships(
  story: StoryRelationshipData
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sourceIds = story.sources.map((source) => source.id);
  const imageIds = [story.hero.id, ...story.figures.map((figure) => figure.id)];

  if (new Set(sourceIds).size !== sourceIds.length) {
    issues.push({
      path: ["sources"],
      message: "Source IDs must be unique within a story.",
    });
  }

  if (new Set(imageIds).size !== imageIds.length) {
    issues.push({
      path: ["figures"],
      message: "Hero and figure IDs must be unique within a story.",
    });
  }

  if (!story.artifact) {
    return issues;
  }

  if (story.format !== "cover-story") {
    issues.push({
      path: ["artifact"],
      message: "Annotated artifacts are only valid for cover stories.",
    });
  }

  if (!imageIds.includes(story.artifact.imageId)) {
    issues.push({
      path: ["artifact", "imageId"],
      message: "The annotated artifact must reference a hero or figure image ID.",
    });
  }

  const markerIds = story.artifact.markers.map((marker) => marker.id);
  if (new Set(markerIds).size !== markerIds.length) {
    issues.push({
      path: ["artifact", "markers"],
      message: "Annotation marker IDs must be unique.",
    });
  }

  for (const [index, marker] of story.artifact.markers.entries()) {
    if (marker.x < 0 || marker.x > 100 || marker.y < 0 || marker.y > 100) {
      issues.push({
        path: ["artifact", "markers", index],
        message: "Annotation coordinates must be percentages from 0 to 100.",
      });
    }

    for (const sourceRef of marker.sourceRefs) {
      if (!sourceIds.includes(sourceRef)) {
        issues.push({
          path: ["artifact", "markers", index, "sourceRefs"],
          message: `Annotation references unknown source ID "${sourceRef}".`,
        });
      }
    }
  }

  return issues;
}
