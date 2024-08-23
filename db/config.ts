import { column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    username: column.text(),
    password_hash: column.text(),
    email: column.text(),
    provider_id: column.text(),
    provider_type: column.text(),
    avatar_url: column.text(),
    total_user_points: column.number(),
    favorite_genres: column.json({optional: true}),
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

export default defineDb({
  tables: {
    User,
    Session,
  },
});
