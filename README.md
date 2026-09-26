# Think Zone

Think Zone is an AI venture studio building intelligent products and systems for real-world work. This repository contains the Next.js marketing site, product and solution pages, an AI opportunity assessment, and a lead intake endpoint backed by PostgreSQL and optional Resend notifications.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The marketing pages work without credentials. The contact endpoint needs at least one delivery channel configured:

- **PostgreSQL persistence:** set `DATABASE_URL` to a PostgreSQL connection string.
- **Email notification:** set `RESEND_API_KEY` and `RESEND_FROM`. The sender address must be verified in Resend. `LEADS_TO` can be a comma-separated list; it defaults to `info@contact.thinkzone.tech`.
- **AI Lab assistant:** set `OPENAI_API_KEY` and `OPENAI_MODEL`. `AI_PROVIDER` defaults to `openai`. Visitor prompts are sent to the configured provider; the assistant request disables response storage and does not use tools. A small per-instance request cap is included; use a shared rate limiter or bot challenge before enabling it on a high-traffic public deployment.
- **AI opportunity assessment:** uses the same `OPENAI_API_KEY`, `OPENAI_MODEL`, and `AI_PROVIDER` settings. Answers remain in the browser unless the visitor explicitly requests an AI reflection. The assessment API does not persist answers; AI requests may incur provider usage charges. A small per-instance request cap is included.
- **Analytics:** optional, consent-gated Google Analytics 4 and PostHog page views. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and/or `NEXT_PUBLIC_POSTHOG_KEY`; `NEXT_PUBLIC_POSTHOG_HOST` defaults to `https://us.i.posthog.com`. Visitors must opt in before either provider is initialized. PostHog autocapture and session recording are disabled. No analytics banner appears when neither provider is configured.
- **Sanity CMS:** set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. Work and Insights use the local starter entries until a project is configured; the editor is available at `/studio` after configuration. Published content is cached for five minutes.

Without either channel the form returns a setup message with a direct email link.

## Database

The lead schema is in `src/db/schema`. Create or update migrations with:

```bash
npm run db:generate -- --name describe-change
npm run db:migrate
```

`db:migrate` applies generated SQL to the database referenced by `DATABASE_URL`. It has not been run here because no database connection was provided.

## Main routes

- `/` — venture studio homepage
- `/products` and `/products/[slug]` — product portfolio and product pages
- `/solutions` and `/solutions/[slug]` — AI capabilities and solution pages
- `/industries`, `/work`, `/ai-lab`, `/insights`, `/about`
- `/assessment` — browser-local opportunity self-assessment with an optional AI-generated reflection (`POST /api/assessment`)
- `/contact` — lead intake form (`POST /api/leads`)
- `/studio` — Sanity editor for Work and Insights content

The assessment always provides a rule-based reflection locally, and can optionally generate a tailored AI reflection after the visitor chooses to send their selected answers. The AI Lab chat is an optional model-backed assistant; both features may incur provider usage charges when configured.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```
