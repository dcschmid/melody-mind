import { column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    username: column.text(),
    email: column.text(),
    provider_id: column.text(),
    provider_type: column.text(),
    avatar_url: column.text(),
    total_user_points: column.number(),
    golden_lps: column.json({ optional: true, default: {} }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    expiresAt: column.date(),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});

const HighscorePerCategory = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    userId: column.text({
      references: () => User.columns.id,
    }),
    category: column.text(),
    score: column.number(),
    language: column.text(),
  },
});

const TotalHighscore = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    userId: column.text({
      references: () => User.columns.id,
    }),
    score: column.number(),
    language: column.text({
      default: "de",
    }),
  },
});

export default defineDb({
  tables: {
    User,
    Session,
    HighscorePerCategory,
    TotalHighscore,
  },
});
