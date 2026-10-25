# Repository Guidelines

## Project Structure & Module Organization

This repository is a small React 19 music player built with Vite. Application code is in `src/`: `App.jsx` contains the main interface and behavior, while `App.css` and `index.css` contain component and global styles. `main.jsx` mounts the app. Local MP3 files and other imported assets belong in `src/assets/`; files served directly by Vite belong in `public/`. There is currently no test directory or test suite.

## Build, Test, and Development Commands

Run these commands from the `music-clone/` project directory:

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally for review.
- `npm run lint` checks source files with Oxlint.

There is no configured test command. Run the build and lint checks when validating code changes.

## Coding Style & Naming Conventions

Use the existing JavaScript and JSX style: ES modules, single-quoted strings, and semicolon-free statements. Follow the surrounding indentation and formatting in each file. Use PascalCase for React components, camelCase for variables and functions, and descriptive lowercase names for asset files. Keep styles in the existing CSS files unless a feature clearly needs a separate module. React hooks must follow the rules enforced by Oxlint.

## Testing Guidelines

No testing framework or coverage target is currently configured. For changes to player behavior or layout, run `npm run lint` and `npm run build`, then manually check the affected interaction in the development server. If tests are added, use a consistent `*.test.jsx` naming pattern and document the test command in `package.json`.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so no established commit convention can be confirmed. Write concise, imperative commit subjects (for example, `Connect song selection to playback`). Pull requests should explain the user-visible change, list validation performed, and include screenshots for visual changes. Link a related issue when one exists.

## Configuration & Assets

Keep dependency versions in `package.json` and commit the matching lockfile changes. Do not commit secrets or machine-specific settings. Reference local audio and image assets through imports or Vite's `public/` paths; avoid embedding large media as source strings.
