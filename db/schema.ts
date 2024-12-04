export const HighscorePerCategory = pgTable("HighscorePerCategory", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => User.id),
  category: text("category"),
  score: integer("score"),
  language: text("language").default("de"),
});
