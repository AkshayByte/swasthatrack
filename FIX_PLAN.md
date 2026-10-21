# SwasthaTrack fix plan

Paste ONE task prompt at a time into Claude Code. After each task: run the tests yourself, read the diff (`git diff`), make Claude Code explain it, then commit. Do not skip ahead.

Start every session with:
> Read CLAUDE.md and FIX_PLAN.md. Confirm you understood the working rules. Do not change anything yet.

---

## Task 0: baseline (read-only)

> Run the backend tests and the frontend build. Report how many tests pass or fail and any warnings. Do not change any file. Then list which files you would need to touch for Tasks 1 to 5.

---

## Task 1: Google-account password flaw (security, do first)

> In `backend/routes/auth.py`, users created through `/auth/google` get a password hash derived from their email, so `/auth/login` accepts a predictable password. Write a test proving that `/auth/login` and `/auth/token` reject that password for a Google-created user. Show it failing. Then fix: create such users with an unusable random password (`secrets.token_urlsafe(32)`), and reject `email_verified` false in the Google token. Also add a standalone script `backend/scripts/reset_google_passwords.py` that re-hashes the password of every user whose hash matches the old predictable pattern, with a `--dry-run` default and an explicit `--apply` flag. Do NOT run the script against any database except a local test SQLite file.

---

## Task 2: auth hardening

> In `backend/routes/auth.py` and `utils/security.py`: (a) if `GOOGLE_CLIENT_ID` is empty, `/auth/google` must fail closed with 503 instead of verifying without an audience; (b) remove the hardcoded superadmin email, use only `SUPERADMIN_EMAILS`; (c) check `is_active` in `login`, `/token` and `get_current_user`, returning 403 or 401 as appropriate; (d) in production (`ENVIRONMENT=production`) raise at startup if `SECRET_KEY` is missing or equals the dev default. Tests first for each. Keep diffs small.

---

## Task 3: CORS, README credentials, seed passwords

> (a) Replace the permissive `https://.*\.vercel\.app` CORS regex with a pattern that only matches this project's own Vercel preview URLs (ask me for the project slug if you need it). (b) Remove the plaintext staff credentials table from `README.md`. (c) Change `seed.py` so staff passwords come from environment variables (`SEED_ADMIN_PASSWORD`, etc.) and are random if unset, printing them once to the local console. Update tests that depend on the old passwords.

---

## Task 4: blocking async routes

> In `backend/routes/auth.py`, `get_current_user`, `login`, `google_login` and `/token` are `async def` but do blocking DB and bcrypt work. Change them to plain `def` so FastAPI runs them in its threadpool, keeping behaviour identical. Confirm all tests still pass. Then explain in plain language why this matters.

---

## Task 5: prescription state machine

> In `backend/schemas/prescription.py` and `routes/prescriptions.py`: make `status` an Enum (`pending`, `dispensed`, `cancelled`). Allow only pending to dispensed and pending to cancelled; dispensed and cancelled are final; make the update idempotent-safe using `UPDATE ... WHERE status='pending'` and checking the affected row count. Remove `doctor` from the roles allowed to change status (only `pharmacist` and `admin`). Set `prescribed_by` from the authenticated user, ignoring any client-supplied doctor name. Tests first, including the illegal transitions and the doctor-cannot-dispense case.

---

## Task 6: real inventory deduction (design first)

> Do not write code yet. Propose how to link prescription medicines to the `medicines` table (a `prescription_items` table with `medicine_id` and `quantity`), including the Alembic migration and how existing JSON data is handled. Show the proposed schema and the dispense algorithm, and wait for my approval.

After you approve:

> Implement the approved design. Dispensing must, in one transaction: for each item run `UPDATE medicines SET current_stock = current_stock - :qty WHERE id = :id AND current_stock >= :qty`, check the affected row count, roll back and return 409 if any item is short, reject expired medicines, then mark the prescription dispensed. Add tests: success, insufficient stock, expired, double-dispense, and a threaded concurrency test on a Postgres test database if one is configured. Stop calling `create_all` in production and run migrations with `alembic upgrade head` instead.

---

## Task 7: queue priority ordering

> Add a numeric `priority_score` column to `QueueEntry` (with an Alembic migration). `GET /api/queue/` must sort by priority score descending, then check-in time ascending. Cap `limit` at 200. Tests first.

---

## Task 8: triage engine

> In `backend/utils/gemini_triage.py`: (a) read the model name only from `GEMINI_MODEL`, with no retired default (tell me which current model name to use after checking Google's docs, and ask me before choosing); (b) send the API key in the `x-goog-api-key` header, not the URL; (c) put all thresholds in one module, each marked `# TODO(clinician-review)`, and make prompt, code and README use that module; (d) always run the rule-based engine first and return the HIGHER urgency of rules and Gemini; (e) use word-boundary matching and basic negation handling ("no chest pain", "heartburn", "heat stroke", "history of asthma" must not trigger emergencies), with tests for each; (f) add heart rate below 50 escalation and pediatric age bands as TODO-marked rules; (g) timeout 3 seconds, one retry, one shared `httpx.AsyncClient`; (h) remove the LLM-generated confidence score from the schema and UI; (i) clamp `priority_score` into the band of the returned urgency; (j) log when the fallback is used. Mock Gemini with `httpx.MockTransport` in tests for: success, 429, timeout, invalid JSON, invalid urgency.

---

## Task 9: frontend honesty

> In `frontend-v2/src/components`: (a) remove `fallbackPatients`, `fallbackQueue`, `fallbackPrescriptions` and `fallbackLabOrders` fake data, and replace every empty `catch {}` with real error and empty states; (b) the pharmacy dispense button must only mark an item dispensed after the API returns success, and must show the real error otherwise; remove the "Inventory updated" claim unless the response confirms it; (c) change `RegistrationDashboard` to call `POST /api/queue/ai-triage` through `lib/api.ts` with full vitals (SpO2, heart rate, temperature, BP), show the `source` field, and allow a clinician to override the urgency, recording that it was overridden; (d) add polling every 10 seconds for queue, prescriptions and lab orders, paused when the tab is hidden; (e) wire `AdminDashboard` to `/api/dashboard`. Keep each change reviewable and run `npm run build`.

---

## Task 10: audit log

> Add an `audit_log` model and Alembic migration (user_id, role, action, resource_type, resource_id, timestamp). Record reads and writes of patient, prescription and lab data in the routes. Add tests.

---

## Task 11: CI and dependency hygiene

> Update `.github/workflows/ci.yml`: add `ruff` for the backend, `astro check` for the frontend, test coverage output, and `pip-audit`. Run backend tests against a Postgres service container in addition to SQLite. Add a Dependabot config. Then tell me how to make Render and Vercel deploy only after CI passes. Do not change deployment settings yourself.

---

## Task 12: README rewrite

> Rewrite `README.md` so every claim matches the code as it now stands. Remove any number that was not measured, including latency figures, TTFB and image sizes. Fix the triage table to match the single thresholds module. Add Limitations and Roadmap sections. Fix the test count by running pytest.

---

## Your own manual steps (Claude Code cannot do these)

- [ ] Run the password-reset script from Task 1 against production yourself, after backing up the DB.
- [ ] Rotate `SECRET_KEY` in Render (this logs everyone out) and any API keys that were ever committed.
- [ ] Set `GEMINI_MODEL` in the Render dashboard, redeploy, then register a test patient and confirm `source` is `"gemini"` in the response.
- [ ] Run `gitleaks detect` over the git history.
- [ ] Measure real latency with k6 or locust before quoting any number.
- [ ] Decide the Gemini data policy: paid tier with data-use terms, and what identifiers you strip.
- [ ] Get a clinician or an ESI handbook to review the threshold module.
