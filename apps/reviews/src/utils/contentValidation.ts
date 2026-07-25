interface ReviewMapPoint {
  target: string;
  trackNumber: number;
}

interface ReviewShape {
  format: "full-review" | "album-of-the-week" | "reappraisal";
  currentAlbumOfTheWeek: boolean;
  reviewMap: ReviewMapPoint[];
  album: { trackCount: number };
  sources: Array<{ id: string }>;
}

export interface ValidationIssue {
  path: Array<string | number>;
  message: string;
}

export function validateReviewRelationships(review: ReviewShape): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const targets = review.reviewMap.map((point) => point.target);
  const sourceIds = review.sources.map((source) => source.id);

  if (new Set(targets).size !== targets.length) {
    issues.push({
      path: ["reviewMap"],
      message: "Review Map targets must be unique.",
    });
  }
  if (new Set(sourceIds).size !== sourceIds.length) {
    issues.push({ path: ["sources"], message: "Source IDs must be unique." });
  }
  review.reviewMap.forEach((point, index) => {
    if (point.trackNumber > review.album.trackCount) {
      issues.push({
        path: ["reviewMap", index, "trackNumber"],
        message: `Track ${point.trackNumber} exceeds the album track count.`,
      });
    }
  });
  if (review.currentAlbumOfTheWeek && review.format !== "album-of-the-week") {
    issues.push({
      path: ["currentAlbumOfTheWeek"],
      message: "Only an Album of the Week entry can be current.",
    });
  }
  return issues;
}
