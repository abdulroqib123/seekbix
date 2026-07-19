# Testing

SeekBix includes a small custom test suite covering the core data and search operations. No test framework is used, tests run directly against the live Supabase backend using the same client the app itself uses, consistent with the project's zero-dependency, no-bundler approach.

## What's covered

| Test | What it verifies |
|---|---|
| Reject entry with missing title | The database's `not null` constraint on `title` is enforced at the database level, not just in the UI |
| Insert valid entry | A correctly formed entry can be created |
| Retrieve inserted entry by id | A created entry can be read back by its id |
| Update persists | Editing an existing entry actually saves the change |
| Search matches body content | Full text search matches against entry content, not just the title, confirming it's real full text search and not a title filter |
| Empty search returns empty array | A query with no matches fails gracefully, returning an empty result instead of throwing an error |
| Delete removes entry | A deleted entry is actually gone on a subsequent read |

Row Level Security was additionally verified manually: a second test account was created and confirmed unable to see or access the first account's entries, in either the entry list or search results.

## Running the tests

1. Log in to the live app in your browser (tests run against your real, authenticated session and rely on RLS being active)
2. Open `tests/test.html` in the same browser
3. Results print automatically, PASS or FAIL, for each check

## Scope

Tests run against the live Supabase project rather than a separate staging database, consistent with the project's zero-cost constraint. Each test run creates one entry and deletes it before finishing, so no data is left behind.