# PrepMaster AI — Architecture & Data Model

## Product rules
- One daily assessment per local calendar date for the personal user.
- Exactly 31 items: 10 vocabulary MCQs, 10 reasoning MCQs, 10 arithmetic/logical MCQs, and 1 coding problem.
- Section durations: 600s, 900s, 1200s, and 1800s (75 minutes total).
- Maximum score: 50 (1 mark per MCQ = 30; coding = 20).
- Phase 1 is a dashboard shell. The test-taking and scoring engines are future phases.

## Adaptive difficulty proposal
Use rolling performance from the last 3 completed tests and topic-level accuracy. Start at Easy. Move Easy -> Medium when overall MCQ accuracy is >= 75% across at least 20 attempted MCQs in the recent window. Move Medium -> Hard at >= 80%. Move down one level when accuracy is < 50%. Add a minimum sample-size guard so a single lucky test cannot jump difficulty. Persist the chosen level in UserProfile and snapshot it into each attempt. The exact thresholds should be configurable after practice data exists.

## Collections

### users (UserProfile model in single-user mode)
- `userId`: stable local profile identifier
- `displayName`, `timezone`, `preferredLanguage`
- `currentDifficulty`
- `topicStats[]`: attempted, correct, accuracy per topic
- `currentStreak`, `longestStreak`, `lastPracticeDate`

### questions
- `section`, `type`, `prompt`, `options[]`
- `answerKey` and `explanation` are excluded from normal query selection
- `topic`, `difficulty`, `marks`, optional `coding` object
- `source`, `fingerprint`, `status`
- `fingerprint` unique index helps prevent duplicate question content

### dailytests
- Unique `testDate` in the user's configured timezone
- Four section records with question references, duration and max marks
- `generationStatus` lifecycle: generating -> review -> published (or failed)

### testattempts
- Test reference, user identifier, lifecycle status and timestamps
- Per-section start/submission times and answer records
- Score, accuracy, unanswered count and difficulty snapshot

## Planned API surface
- `GET /api/health` — API health
- `GET /api/tests/today` — get today's published test (Phase 2)
- `POST /api/tests/today/start` — create/resume attempt (Phase 2)
- `POST /api/attempts/:attemptId/sections/:sectionKey/submit` — submit a section (Phase 2)
- `POST /api/attempts/:attemptId/coding` — submit code to sandbox (Phase 5)
- `GET /api/attempts/:attemptId/result` — evaluated result (Phase 4)
- `GET /api/analytics/overview` — progress summary (Phase 6)

## AI generation pipeline (Phase 3)
1. Load topic blueprint, current adaptive difficulty, and recent question fingerprints.
2. Ask OpenAI Responses API for schema-constrained JSON.
3. Validate counts, section membership, options, answer key, difficulty, and marks in Node.
4. Run deterministic checks where possible (e.g. arithmetic answer recomputation) and review suspicious items.
5. Deduplicate by normalized prompt fingerprint and recent topic history.
6. Save as draft/review; publish only after validation passes.
7. Keep answer keys and explanations server-side until the relevant section is submitted.

## Timer and integrity rules (Phase 2)
- Store `sectionStartedAt` and `deadlineAt` on the server.
- Browser timer is a display only; server rejects submissions after the deadline and auto-finalizes expired sections.
- Do not allow a client to submit its own score or correct-answer flags.
- Use idempotent submission endpoints to avoid duplicate scoring on retries.

## Code execution rules (Phase 5)
- Never run learner code using Node `child_process` on the web application server.
- Send code to an isolated execution provider/container with CPU, memory, time and network restrictions.
- Use hidden test cases on the evaluator side; do not expose hidden input/output to the browser.
- Store execution IDs and summarized test results, not arbitrary execution privileges.
