# SwasthaTrack: instructions for Claude Code

Hospital workflow system: FastAPI backend (`backend/`), Astro + React frontend (`frontend-v2/`), Postgres in production, SQLite locally. This repo is a portfolio project that is being hardened. The owner will explain every change in job interviews, so changes must be small, readable and explainable.

## Commands

- Backend tests: `cd backend && python -m pytest -v`
- Frontend check: `cd frontend-v2 && npm ci && npm run build`
- Backend dev server: `cd backend && uvicorn main:app --reload --port 8000`

Run the relevant tests before saying any task is done. Report real output, never assumed output.

## Working rules (non-negotiable)

1. Work only on the current git branch. Never commit, push, merge or rewrite history. The owner commits.
2. One task at a time. Do not start the next task or "also fix" unrelated things. If you notice another problem, list it at the end and stop.
3. Test first: write a test that fails for the bug, show it failing, then fix, then show it passing.
4. Never connect to, migrate, seed or modify any production or hosted database. Never run `seed.py` against anything except a local SQLite file. Never read, print or edit real secrets or `.env` files.
5. Do not add dependencies without asking first. Say what and why.
6. Do not invent clinical values. Triage thresholds must live in one module, each marked `# TODO(clinician-review)`. If a clinical number is needed, ask the owner for a source.
7. Keep diffs small and in the existing style. No drive-by refactors, no reformatting of untouched code.
8. If you are unsure, say so and ask. Do not guess silently.

## Report format after every task

- **What changed** (files, in plain language)
- **Why** (the bug or risk it fixes)
- **How to verify** (exact commands and expected results)
- **Not done / still risky**
- **Interview explanation** (3 sentences the owner could say out loud)

## Verified facts about the current code (do not re-derive, but do re-check before editing)

- Roles are plain strings: `admin`, `doctor`, `pharmacist`, `lab`, `registration`, `user`. Routes check `current_user.role` against allow-lists; the role is loaded from the DB in `get_current_user`.
- `QueueEntry.queue_number` is unique. `add_to_queue` retries on `IntegrityError` up to 5 times. Keep this behaviour.
- `Patient.phone` and `Patient.registration_number` are unique.
- `update_prescription_status` only sets a status string. It does NOT deduct stock. Prescription medicines are a JSON string, not linked rows.
- `get_current_user`, `login`, `google_login` and `/token` are `async def` but use blocking SQLAlchemy and bcrypt.
- Google-created users get a predictable password hash derived from their email (security bug).
- `create_tables()` (create_all) runs at startup alongside Alembic.
- The registration screen computes triage client-side from symptoms, temperature and BP only. The backend endpoint is `POST /api/queue/ai-triage`.
- Dashboards use `catch {}` and hardcoded fallback data. The pharmacy UI shows "Inventory updated" without any backend change.
- No polling or websocket in the data components.
- `GEMINI_MODEL` defaults to `gemini-1.5-flash`, which is probably retired.

## Definition of done for the whole effort

All items in `FIX_PLAN.md` complete, all tests green, README matches the code, no claim in the README that the code does not back up.
