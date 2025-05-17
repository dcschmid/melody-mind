# Achievement System Architecture

## Overview

This document illustrates the architecture of the MelodyMind achievement system, focusing on how the
Achievement Unlock API integrates with other components of the application.

## System Architecture

The achievement system is designed with the following key components:

1. **API Layer**: RESTful endpoints for achievement operations
2. **Service Layer**: Business logic for achievement processing
3. **Database Layer**: Persistent storage for achievements and user progress
4. **UI Components**: User interface for displaying and interacting with achievements
5. **Event System**: Communicates achievement events across the application

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Application                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │             │  │             │  │                         │  │
│  │ Achievement │  │ Achievement │  │  Achievement            │  │
│  │ Displays    │◄─┤ Store       │◄─┤  Notification System    │  │
│  │             │  │             │  │                         │  │
│  └─────────────┘  └──────▲──────┘  └─────────────▲───────────┘  │
│                          │                        │              │
└──────────────────────────┼────────────────────────┼──────────────┘
                           │                        │
                           │   ┌──────────────┐    │
                           │   │              │    │
                           └───┤ Event System ├────┘
                               │              │
                               └───────▲──────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────┐
│                                      │                          │
│                               Server Application                │
│                                                                 │
│  ┌─────────────────┐    ┌────────────▼─────────────┐            │
│  │                 │    │                          │            │
│  │   API Routes    │    │  Achievement Service     │            │
│  │                 │    │                          │            │
│  │  ┌────────────┐ │    │ ┌──────────────────────┐ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  │ Unlock API ├─┼────┼─┤ unlockAchievement()  │ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  └────────────┘ │    │ └──────────────────────┘ │            │
│  │                 │    │                          │            │
│  │  ┌────────────┐ │    │ ┌──────────────────────┐ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  │ Check API  ├─┼────┼─┤ checkAchievement()   │ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  └────────────┘ │    │ └──────────────────────┘ │            │
│  │                 │    │                          │            │
│  │  ┌────────────┐ │    │ ┌──────────────────────┐ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  │ List API   ├─┼────┼─┤ listAchievements()   │ │            │
│  │  │            │ │    │ │                      │ │            │
│  │  └────────────┘ │    │ └──────────────────────┘ │            │
│  │                 │    │                          │            │
│  └─────────────────┘    └──────────┬───────────────┘            │
│                                    │                             │
│                                    ▼                             │
│                         ┌─────────────────────┐                  │
│                         │                     │                  │
│                         │  Authentication     │                  │
│                         │  Middleware         │                  │
│                         │                     │                  │
│                         └─────────┬───────────┘                  │
│                                   │                              │
│                                   ▼                              │
│                         ┌─────────────────────┐                  │
│                         │                     │                  │
│                         │  Database Access    │                  │
│                         │  Layer              │                  │
│                         │                     │                  │
│                         └─────────┬───────────┘                  │
│                                   │                              │
└───────────────────────────────────┼──────────────────────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │                      │
                         │      Database        │
                         │                      │
                         │  ┌───────────────┐   │
                         │  │ achievements  │   │
                         │  └───────────────┘   │
                         │                      │
                         │  ┌───────────────┐   │
                         │  │ user_         │   │
                         │  │ achievements  │   │
                         │  └───────────────┘   │
                         │                      │
                         └──────────────────────┘
```

## Data Flow: Achievement Unlock Process

The following sequence diagram illustrates the flow of data when unlocking an achievement:

```
┌────────┐          ┌─────────┐          ┌────────────┐          ┌────────────┐          ┌──────────┐
│ Client │          │ API     │          │ Auth       │          │ Achievement │          │ Database │
│        │          │ Route   │          │ Middleware │          │ Service    │          │          │
└───┬────┘          └────┬────┘          └─────┬──────┘          └──────┬─────┘          └────┬─────┘
    │                     │                     │                        │                     │
    │  POST /api/.../unlock │                     │                        │                     │
    │ ──────────────────> │                     │                        │                     │
    │                     │                     │                        │                     │
    │                     │ Check Authentication│                        │                     │
    │                     │ ───────────────────>│                        │                     │
    │                     │                     │                        │                     │
    │                     │    User Verified    │                        │                     │
    │                     │ <───────────────────│                        │                     │
    │                     │                     │                        │                     │
    │                     │         Validate Request                     │                     │
    │                     │ ──────────────────────────────────────>     │                     │
    │                     │                     │                        │                     │
    │                     │                     │ unlockAchievement()    │                     │
    │                     │                     │ ───────────────────────>                     │
    │                     │                     │                        │                     │
    │                     │                     │                        │  Check Existing     │
    │                     │                     │                        │ ──────────────────> │
    │                     │                     │                        │                     │
    │                     │                     │                        │  Query Result       │
    │                     │                     │                        │ <────────────────── │
    │                     │                     │                        │                     │
    │                     │                     │                        │  Insert/Update      │
    │                     │                     │                        │ ──────────────────> │
    │                     │                     │                        │                     │
    │                     │                     │                        │  Success            │
    │                     │                     │                        │ <────────────────── │
    │                     │                     │                        │                     │
    │                     │                     │ Achievement Data       │                     │
    │                     │                     │ <───────────────────────                     │
    │                     │                     │                        │                     │
    │                     │   Prepare Response  │                        │                     │
    │                     │ <──────────────────────────────────────     │                     │
    │                     │                     │                        │                     │
    │   JSON Response     │                     │                        │                     │
    │ <────────────────── │                     │                        │                     │
    │                     │                     │                        │                     │
    │  Display Achievement│                     │                        │                     │
    │ ────────────────────┼─────────────────────┼────────────────────────┼─────────────────────┘
    │                     │                     │                        │
```

## Database Schema

The achievement system uses the following database tables:

### Achievements Table

```sql
CREATE TABLE achievements (
  id VARCHAR(50) PRIMARY KEY,
  name_key VARCHAR(100) NOT NULL,
  description_key VARCHAR(200) NOT NULL,
  points INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Achievements Table

```sql
CREATE TABLE user_achievements (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, achievement_id)
);
```

### Achievement Requirements Table

```sql
CREATE TABLE achievement_requirements (
  id VARCHAR(50) PRIMARY KEY,
  achievement_id VARCHAR(50) NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,
  target_value INTEGER NOT NULL,
  params JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);
```

## Achievement Categories

The system defines the following achievement categories:

| Category    | Description                                  | Example                                      |
| ----------- | -------------------------------------------- | -------------------------------------------- |
| gameplay    | Related to general gameplay mechanics        | "Answer 100 questions correctly"             |
| progression | Milestones in player progression             | "Complete 10 games"                          |
| collection  | Collecting or experiencing specific content  | "Play all genres at least once"              |
| social      | Social interactions and multiplayer          | "Challenge 5 different friends"              |
| challenge   | Difficult or skill-based achievements        | "Get a perfect score on Hard difficulty"     |
| hidden      | Secret achievements not shown until unlocked | "Answer all questions within 5 seconds each" |

## Achievement Difficulty Levels

Achievements are categorized into difficulty levels:

| Level    | Points | Requirements                                 | Visual Indicator |
| -------- | ------ | -------------------------------------------- | ---------------- |
| bronze   | 50     | Basic gameplay, easily attainable            | 🥉               |
| silver   | 100    | Moderate challenge, requires some dedication | 🥈               |
| gold     | 250    | Significant challenge, requires skill        | 🥇               |
| platinum | 500    | Exceptional achievement, requires mastery    | 💎               |

## Implementation Considerations

### Scalability

The achievement system is designed to handle:

- High volume of concurrent unlock requests
- Large number of achievements (1000+)
- Millions of user achievement records

Key scalability features:

- Caching of common responses
- Efficient database queries with proper indexes
- Asynchronous achievement processing for complex calculations

### Security

Security measures implemented:

- Authentication required for all achievement operations
- Validation of all input data
- Prevention of achievement spoofing
- Rate limiting to prevent abuse

### Performance Optimization

Performance considerations:

- Memoization of common API responses
- Efficient validation of achievement IDs
- Batched database operations for multiple achievements
- Selective querying to minimize database load

## Related Documentation

- [Achievement Unlock API Reference](../api/achievements-unlock.md)
- [Achievement Types](../types/achievement-api-types.md)
- [Using the Achievement API](../examples/using-achievement-unlock-api.md)
- [Achievement Database Structure](../database/achievement-system.md)
