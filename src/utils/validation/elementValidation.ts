/**
 * Element Validation Utilities
 *
 * Centralized utilities for DOM element validation.
 * Eliminates duplicate validation logic across components.
 */

import { safeGetElementById } from "../dom/domUtils";

export interface ElementValidationResult {
  isValid: boolean;
  missingElements: string[];
  foundElements: Record<string, HTMLElement>;
}

/**
 * Validate that all required elements exist
 */
export function validateRequiredElements(
  elementIds: string[],
  context: string = "component"
): ElementValidationResult {
  const missingElements: string[] = [];
  const foundElements: Record<string, HTMLElement> = {};

  elementIds.forEach((id) => {
    const element = safeGetElementById(id);
    if (element) {
      foundElements[id] = element;
    } else {
      missingElements.push(id);
    }
  });

  const isValid = missingElements.length === 0;

  if (!isValid) {
      component: context,
      action: "validation",
      data: { missingElements, requiredElements: elementIds },
    });
  }

  return {
    isValid,
    missingElements,
    foundElements,
  };
}

/**
 * Validate game elements with specific game context
 */
export function validateGameElements(
  elementIds: string[],
  gameType: string = "game"
): ElementValidationResult {
  return validateRequiredElements(elementIds, `${gameType}-engine`);
}

/**
 * Create element validator for specific component
 */
export function createElementValidator(componentName: string) {
  return (elementIds: string[]): ElementValidationResult => {
    return validateRequiredElements(elementIds, componentName);
  };
}

/**
 * Validate elements with custom error handling
 */
export function validateElementsWithHandler(
  elementIds: string[],
  context: string,
  onMissing?: (missingIds: string[]) => void
): boolean {
  const result = validateRequiredElements(elementIds, context);

  if (!result.isValid && onMissing) {
    onMissing(result.missingElements);
  }

  return result.isValid;
}
