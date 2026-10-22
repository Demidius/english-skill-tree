# Shared textbook vocabulary

The catalog adds English File 4th edition Pre-Intermediate (42 lessons including Practical English) and Intermediate (25 lessons), using 2,162 distinct word/meaning or phrase entries and 2,443 lesson references. There are 240 entries shared by multiple lessons.

`data/textbook-vocabulary.json` is the editable source. Each entry has a stable ID, an explicit sense, first lesson, all lesson IDs, Russian meaning, optional forms and contextual examples. `matches` is an explicitly reviewed list of existing `[topicId, wordKey, English, Russian]` rows with the same meaning. Matching is never guessed from spelling at runtime. For example, adjective `cold` and illness `cold`, and noun and verb `offer`, stay separate. Plural forms such as `shelf / shelves` share progress.

Run `npm run build:vocabulary` after changing the source. The generated synchronous script works on GitHub Pages and with the existing offline cache, without a database migration or an additional request at startup.

`textbook-vocabulary.js` maps stable entry IDs to the existing `topicId|wordKey` store. It reuses 520 existing meanings and introduces 1,642 new records. For duplicate existing rows, the earliest level and base topic is retained; historical keys and their existing aliases remain readable. The latest timestamp wins, including a later explicit reset. The complete SRS tuple (level, review time/count, due date, interval and ease) is reused. Catalog adaptation performs no progress writes.

New records live once in the existing thematic branches as Extra vocabulary. `data-textbook-topics.js` routes each lesson to a Student's Book topic and explicitly separates incidental vocabulary by meaning: for example, clothes, positions and household objects from PI 1C have different destinations. Each topic card contains at most 24 entries. Different meanings with the same spelling remain separate. Opening a card or practicing it uses only that card's words. There is no separate textbook selector or Textbook lessons branch.

The original 1,642 lesson-owned progress keys are retained as aliases and included in pending-write restoration. `tests/fixtures/textbook-progress-keys.json` records the keys used before regrouping; tests verify every existing SRS tuple and later explicit reset through the actual progress reader. The 520 reused entries retain their canonical locations. No progress records are written during catalog adaptation, and no words are removed.

Main topics remain the existing Student's Book curriculum. Supplementary entries from the combined SB/WB source are Extra, with source lesson codes retained for search and cross-links. User-facing lesson descriptions list SB/Vocabulary Bank references; original combined provenance remains in the editable data. Unknown parts of speech are left unlabelled.

Global inventory and review queues contain the physical canonical records once. Lesson lists use references to those records and deduplicate within each lesson. A repeated word therefore has one level and one review schedule even when shown in several lessons or books.

Book identity is separate from CEFR: `PI` uses rule level A2 and `INT` uses B1. Elementary vocabulary on A2 does not link to the unrelated Pre-Intermediate grammar lesson with the same code. Search accepts `PI 1A` and `INT 1A`; a result moves the camera and highlights a tree node without opening a dialog. Lesson references still open reciprocal vocabulary/rule links where that book has a corresponding rule.

Validation: `npm run test:unit` includes catalog integrity, preservation of every old key, shared SRS/reset behavior, global queue uniqueness, distinct senses, book-specific search/links, forms, and source/bundle parity. The existing Firestore rules/access tests remain unchanged. The missing `tests/ef-course.test.cjs` baseline suite has also been restored from its existing root-level copy so the declared unit command can run.

No production data, authentication rules, or account permissions are changed. This branch is prepared for review; publishing requires merging it into the Pages source branch.

