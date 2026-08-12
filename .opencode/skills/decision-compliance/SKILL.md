---
name: decision-compliance
description: Use when writing code, choosing a library/datastore/protocol, changing infrastructure, or authoring docs in a repo that carries architectural governance (ADRs, decision logs, AGENTS.md/CLAUDE.md, CONTRIBUTING, RFCs, or constraints written into READMEs). Discovers whichever governance form the project actually uses, checks the planned change against it before editing, and creates or amends a decision record when the change sets precedent. Also triggers when the user says "check the ADRs", "is this allowed", "document this decision", or when you are about to contradict a written constraint.
---

# Skill: Decision Compliance

Projects encode constraints in wildly different places. Some have a formal `docs/decision-log/ADR-NNN-*.md` set; some have one `CONSTRAINTS` section in a README; some have nothing but a `CONTRIBUTING.md` and strong conventions in the code. This skill makes you **find whatever governance actually exists, obey it, and extend it in its own idiom** — never impose a template the project doesn't use.

The failure mode this prevents: an agent confidently introduces Redis, a second database, a new auth scheme, or a new directory layout that a document three folders away explicitly rejected eighteen months ago.

---

## Phase 1 — Discovery (do this before the first edit, once per session)

Run a cheap, bounded search. Do not read every file you find; read titles and headings first, then read in full only what bears on the current change.

**1a. Agent-facing config** — these are the highest-signal files because someone deliberately pointed a model at them:

- `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`
- `opencode.json` / `.opencode/`, `.claude/`, `.cursor/`, `.aider.conf.yml`
- Any `instructions` / `context` / `rules` array inside those configs — **the listed files are the project's declared source of truth. Read that list first and treat it as the reading order.**

**1b. Formal decision records**, under any of these names:

```
docs/decision-log/  docs/adr/  docs/decisions/  doc/adr/  adr/  rfcs/  docs/rfc/
ADR-*.md  *-adr.md  0001-*.md  RFC-*.md  DESIGN.md  DECISIONS.md
```

**1c. Informal constraint carriers**, when 1b is empty:

- `CONTRIBUTING.md`, `README.md` (§Constraints / §Non-goals / §Principles / §Architecture)
- `docs/architecture/**`, `docs/patterns/**`, `docs/best-practices/**`
- `.github/PULL_REQUEST_TEMPLATE.md`, issue templates, preflight/checklist docs
- CI config that *encodes* a rule (a lint gate, a dependency allowlist, a forbidden-import check, a schema-boundary test)
- `.editorconfig`, lockfiles, `Makefile` targets — weak signals, but they reveal the sanctioned toolchain

**1d. Record what you found.** State it to the user in one or two lines before proceeding, e.g. *"Governance found: 11 ADRs in `docs/decision-log/`, plus `AGENTS.md` §Always/§Never and a preflight checklist. Checking this change against ADR-002 and ADR-006."* If you found **nothing**, say that too — it changes what you are allowed to do (see Phase 4).

---

## Phase 2 — The compliance gate

Before you write code or docs, answer these four questions. Silently is fine; surface the answer only when it is non-obvious or when the answer is "conflict".

1. **Does a written decision cover this?** Match on the *subject* of your change, not on keywords: datastore, messaging, auth, deployment target, language/framework, module boundaries, logging/telemetry, error handling, API shape, branching and PR discipline.
2. **Does my planned change comply?** Quote the specific line or section you are complying with. If you cannot quote it, you have not actually checked.
3. **Is the record stale?** Compare it against the code. A decision that says "no Redis" while `docker-compose.yml` runs Redis is *drift* — handle via Phase 5, do not silently pick a side.
4. **Does this change set new precedent?** If a future contributor could reasonably make the opposite choice and be right, you are making a decision that deserves a record — go to Phase 3.

**Hard rule: never contradict an accepted decision record silently.** If the right engineering answer conflicts with the record, stop and present the conflict to the user with (a) the record's exact constraint, (b) why the code
wants to differ, (c) options: comply, amend the record, or supersede it. The user decides. An agent unilaterally overriding an accepted ADR is the single most damaging thing this skill exists to prevent.

Corollary: also never *cite* a record you have not read in this session. Quoting an ADR number from memory or from a filename is how fabricated constraints get laundered into the codebase.

---

## Phase 3 — Creating or amending a record

### Match the existing idiom first

If the project already has records, **open two of them and copy their structure exactly** — heading set, numbering scheme, status vocabulary, front-matter, cross-link style, whether they reference issues. Consistency with the local format outranks any canonical ADR template, including the one below.

Numbering: continue the existing sequence. Check for gaps — a missing number (e.g. no ADR-008) usually means withdrawn or in-flight, so do not reuse it without asking.

### Default template (only when the project has no precedent)

```markdown
# ADR-NNN: <Decision in imperative form>

## Context
What forces are in play. Cite the requirement, constraint, issue, or measurement that made this a question. Include real cost/time/scale numbers where they drove the outcome.

## Decision
The choice, stated flatly. "Adopt X for Y." Include the concrete matrix, config, or boundary the decision fixes.

## Consequences
### Positive
### Negative
### Mitigations
For each negative, the specific control that contains it.

## Alternatives considered
| Alternative | Reason rejected |

## References
Links to the real files, issues, and docs this depends on.

## Status
PROPOSED | ACCEPTED (date) | SUPERSEDED BY ADR-NNN | DEPRECATED
```

### Rules that hold regardless of format

- **One decision per record.** If you are writing "and also" in the Decision section, split it.
- **Never invent links.** Every path and issue reference must resolve. Verify before writing; a broken cross-reference in a governance doc poisons every future agent that reads it.
- **Amend, don't rewrite.** To change an accepted record, add a titled section documenting the amendment and why, or supersede it with a new record and set the old one's status. Preserve the original reasoning — the history *is* the value.
- **Status is not decoration.** Do not mark something ACCEPTED on your own authority. New records you author start as PROPOSED (or the project's equivalent) unless the user explicitly accepts them.
- **Register the record where records are registered.** If the project lists its decisions somewhere — an agent config `instructions` array, an index, a context map, a docs nav — add the new file there. An unregistered ADR is invisible to the next agent, which defeats the entire point.

---

## Phase 4 — Adapting when there are no ADRs

Do not conclude "no ADRs, therefore no constraints." Climb this ladder and stop at the first rung that yields something binding:

1. **Agent config instruction lists** — treat every listed file as normative.
2. **Explicit prose constraints** — §Never, §Always, §Non-goals, §Out of scope, §Principles, "we deliberately do not…". These are ADRs without the ceremony. Cite them by file and heading exactly as you would cite an ADR.
3. **Machine-enforced rules** — CI gates, lint configs, forbidden-import checks, dependency allowlists, schema tests. Strongest possible signal: someone cared enough to automate it. Never work around one; if a gate blocks you, that gate is the decision.
4. **Consistent code convention** — if every module does it one way across many files, that is a decision nobody wrote down. Follow it. Do not "improve" it as a side effect of an unrelated task.
5. **Genuinely nothing** — then you have latitude, but say so explicitly: *"No governance covers this choice; I'm picking X because Y."* Offer, once, to start a lightweight decision log. **Do not create a `docs/adr/` tree in a project that never asked for one** — an unsolicited governance framework is noise, and a five-line §Decisions section in the README often serves better. Scale the ceremony to the project.

---

## Phase 5 — Drift

When a record and the code disagree, the record is not automatically right and neither is the code. **Report; do not reconcile on your own.** Give the user:

- the record's exact claim, with file and section
- the contradicting reality, with file and line
- which one appears newer (git log on both is usually decisive)
- the two repair options: fix the code, or amend/supersede the record

Then wait. Silently "fixing" either side destroys information about why the
divergence happened — and if the code is right, the drift itself is the thing
worth documenting.

---

## Reporting

Keep compliance reporting proportional. For a routine change that plainly complies, one clause is enough: *"Complies with ADR-002 (PostgreSQL-only) — using the existing `oltp` schema."* Reserve a fuller writeup for changes that set precedent, hit a conflict, or surface drift.

Never end a governed change without saying which constraint you checked it against. Silence reads as "unchecked", and the next agent inherits that doubt.

---

## Anti-patterns

- Citing an ADR number without reading the file in this session.
- Reading only the ADR titles and assuming the contents.
- Creating a new ADR for something an existing one already covers — amend it.
- Writing an ADR after the code is merged, reverse-engineered to fit. The record is the reasoning, not a receipt.
- Imposing the canonical ADR template on a project with its own working format.
- Treating an absent decision log as an absent decision.
- Marking your own record ACCEPTED.
- Rewriting an accepted record's history to match a new decision.
