# Shared textbook vocabulary

The catalog adds English File 4th edition Pre-Intermediate (42 lessons including Practical English) and Intermediate (25 lessons), using 2,162 distinct word/meaning or phrase entries and 2,443 lesson references. There are 240 entries shared by multiple lessons.

`data/textbook-vocabulary.json` is the editable source. Each entry has a stable ID, an explicit sense, first lesson, all lesson IDs, Russian meaning, optional forms and contextual examples. `matches` is an explicitly reviewed list of existing `[topicId, wordKey, English, Russian]` rows with the same meaning. Matching is never guessed from spelling at runtime. For example, adjective `cold` and illness `cold`, and noun and verb `offer`, stay separate. Plural forms such as `shelf / shelves` share progress.

Run `npm run build:vocabulary` after changing the source. The generated synchronous script works on GitHub Pages and with the existing offline cache, without a database migration or an additional request at startup.

`textbook-vocabulary.js` maps stable entry IDs to the existing `topicId|wordKey` store. It reuses 520 existing meanings and introduces 1,642 new records. For duplicate existing rows, the earliest level and base topic is retained; historical keys and their existing aliases remain readable. The latest timestamp wins, including a later explicit reset. The complete SRS tuple (level, review time/count, due date, interval and ease) is reused. Catalog adaptation performs no progress writes.

New records live once in the “Уроки учебников” branch. A tree card counts the new records physically stored there; opening it or practicing it uses the entire lesson list, including references to earlier words. The “Лексика по учебникам” selector gives the full lesson count, personal new/started/known/due counts and practice. “Впервые в этих двух учебниках” describes source ordering, not a learner's knowledge or novelty relative to older site content. Unknown parts of speech are left unlabelled.

Global inventory and review queues contain the physical canonical records once. Lesson lists use references to those records and deduplicate within each lesson. A repeated word therefore has one level and one review schedule even when shown in several lessons or books.

Book identity is separate from CEFR: `PI` uses rule level A2 and `INT` uses B1. Elementary vocabulary on A2 does not link to the unrelated Pre-Intermediate grammar lesson with the same code. Search accepts `PI 1A` and `INT 1A`; a result moves the camera and highlights a tree node without opening a dialog. Lesson references still open reciprocal vocabulary/rule links where that book has a corresponding rule.

Validation: `npm run test:unit` includes catalog integrity, preservation of every old key, shared SRS/reset behavior, global queue uniqueness, distinct senses, book-specific search/links, forms, and source/bundle parity. The existing Firestore rules/access tests remain unchanged. The missing `tests/ef-course.test.cjs` baseline suite has also been restored from its existing root-level copy so the declared unit command can run.

No production data, authentication rules, or account permissions are changed. This branch is prepared for review; publishing requires merging it into the Pages source branch.
