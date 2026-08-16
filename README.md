# CodeFix

A React dashboard for ESLint reports. Drop in a JSON report, browse the findings by severity, and pull an AI-generated fix suggestion for any individual issue.

Everything runs in the browser — no backend, no database. The last report, repo settings, and language are kept in `localStorage`.

## Getting started

```bash
npm install && npm run dev
```

The app runs at `http://localhost:5173`.

Fix suggestions need an OpenAI API key:

```bash
cp .env.example .env
```

| Variable              | Required                 | Default        |
| --------------------- | ------------------------ | -------------- |
| `VITE_OPENAI_API_KEY` | Yes, for fix suggestions | —              |
| `VITE_OPENAI_MODEL`   | No                       | `gpt-4.1-mini` |

> **Security note:** Vite inlines every `VITE_*` variable into the client bundle, so the API key ships to the browser. Fine for local use — do not deploy this app publicly without moving the OpenAI call behind a server-side proxy. Upload, search, and filtering work without a key.

## Usage

1. Generate a report: `npx eslint . -f json -o eslint-report.json`
2. Drop the JSON onto the dropzone (step 1). This is enough to browse, search, and filter issues.
3. For fix suggestions, fill in step 2: repository link, branch, and the absolute path the analysis ran from — CodeFix strips that prefix from each `filePath` to derive the repo-relative path.
4. Click "Fetch fix suggestion" on an issue. Files are read from `raw.githubusercontent.com`, so the repository must be public.

## Scripts

`npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Project structure

Components follow atomic design — atoms compose into molecules, molecules into organisms, organisms into pages.

```
src/
├── components/      # atoms/, molecules/, organisms/, pages/
├── hooks/           # useDebounce, useI18n
├── i18n/            # translator + locales/{en,tr}.json
├── prompts/         # LLM prompt templates
├── services/        # ESLint report parsing, OpenAI client
└── utils/           # classNames, date, format, path, storage
```

Translation keys are namespaced and looked up by path — `t("issues.card.line")` — with `{{param}}` interpolation and `key_one` / `key_other` plural forms. Missing keys fall back to the default locale, then to English.

## Limitations

- Only ESLint JSON reports are supported.
- Fix suggestions require a **public** GitHub repository.
- The API key is client-side (see the security note above).

## License

MIT
