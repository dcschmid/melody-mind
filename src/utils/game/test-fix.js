/**
 * Test script to verify the fix for the shuffledAlbums.flatMap error
 */

import { getRandomQuestion } from "./getRandomQuestion.ts";

// Test with albums as a valid array
const validAlbums = [
  {
    coverSrc: "/path/to/cover.jpg",
    artist: "Test Artist",
    album: "Test Album",
    year: "2025",
    questions: {
      easy: [
        {
          question: "Test question?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          trivia: "This is a test trivia",
        },
      ],
      medium: [],
      hard: [],
    },
  },
];

// Test with not-an-array value
const invalidAlbums = { albums: validAlbums };

// Test valid case
console.log("Testing with valid albums array:");
const result1 = getRandomQuestion(validAlbums, "easy", 10);
console.log("Result:", result1 ? "Question retrieved successfully" : "No question found");

// Test invalid case (should handle gracefully)
console.log("\nTesting with invalid albums object:");
try {
  // @ts-ignore - Intentionally passing wrong type for testing
  const result2 = getRandomQuestion(invalidAlbums, "easy", 10);
  console.log(
    "Result:",
    result2 ? "Question retrieved successfully" : "No question found (handled gracefully)"
  );
} catch (error) {
  console.error("Error occurred:", error);
}

// Test with null
console.log("\nTesting with null:");
try {
  // @ts-ignore - Intentionally passing wrong type for testing
  const result3 = getRandomQuestion(null, "easy", 10);
  console.log(
    "Result:",
    result3 ? "Question retrieved successfully" : "No question found (handled gracefully)"
  );
} catch (error) {
  console.error("Error occurred:", error);
}

console.log("\nTests completed");
