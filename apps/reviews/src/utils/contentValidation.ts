interface ReviewShape {
  sources: Array<{ id: string }>;
}

export interface ValidationIssue {
  path: Array<string | number>;
  message: string;
}

export function validateReviewRelationships(review: ReviewShape): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sourceIds = review.sources.map((source) => source.id);

  if (new Set(sourceIds).size !== sourceIds.length) {
    issues.push({ path: ["sources"], message: "Source IDs must be unique." });
  }
  return issues;
}
