# Research: consuming API specs from an external repo (Zudoku)

Status: parked. Revisit when the company's integration details are known.

## What exists
- Content repo: https://github.com/agustintamb/sandbox-api-center (public)
  - `apis.json` manifest (id, name, description, status, category, tags, versions[{id,label,file}])
  - `apis/<id>/<version>.yaml`, `docs/CONTRIBUTING.md`
- Portal-side prototype (not kept in any branch; the code was discarded, this is the design):
  - A sync script (predev/prebuild) downloads apis.json + specs over HTTPS into a gitignored `api-center/`
  - A small module reads that manifest; `zudoku.config.tsx`, the API Store page and the footer all build their lists from it
  - `apis` in the config is built by mapping the manifest (`type: "file"`, array input when there is more than one version)

## Findings
- Zudoku `apis` config is applied at startup, so changing the catalog needs a dev restart / rebuild.
- `type: "url"` inputs are fetched at build, but tag/operation pages are NOT prerendered (404 in built site: /api-store/petstore/pet). Use local `file` inputs.
- Fetch cost is ~1-2 s; the Zudoku build (~40 s) dominates deploy time.
- `zudoku/vite` plugin is not usable outside the Zudoku CLI, so no custom Vite hooks for fetching.

## Options compared
1. HTTPS download of files (implemented): simple, no commit in portal repo, 1 request + 1 per spec.
2. Tarball (codeload .../tar.gz/main): one request regardless of spec count.
3. Git submodule: pointer commit needed per update (or `--remote` always, which makes the pointer moot).
4. npm package / GitHub release artifact: versioned, cacheable, needs publish step in the content repo.
5. Runtime fetch: not viable with Zudoku prerendering.

## Deploy automation ideas
- `repository_dispatch` from the content repo on push to main triggers the portal build/deploy.
- Cache node_modules in CI; optionally skip build if hash of apis.json + specs is unchanged.
- Private repos need a token (GITHUB_TOKEN / PAT) in the fetch or tarball step.

## Open questions for the company
- Where are specs hosted (GitHub, GitLab, Azure DevOps, internal registry/API gateway)? Auth method?
- Where is the portal deployed (Pages, Vercel, Netlify, internal)? CI system?
- Do specs already have a catalog/manifest, or should one be generated from folder structure?
- Pinned vs always-latest builds?
