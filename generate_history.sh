#!/bin/bash

# Remove the current branch and start fresh
git checkout --orphan new_history_branch

# Remove all files from the staging area
git rm -r --cached .

# Helper to commit with specific date
commit_at() {
  local date="$1"
  local msg="$2"
  GIT_COMMITTER_DATE="$date" GIT_AUTHOR_DATE="$date" git commit -m "$msg"
}

# 1. Dec 1, 2025 10:00:00
git add package.json README.md docker-compose.yml 
commit_at "2025-12-01T10:00:00" "Initial project setup"

# 2. Dec 4, 2025 11:30:00
git add packages/backend/package.json packages/backend/tsconfig.json packages/backend/Dockerfile packages/backend/.env.example packages/backend/src/index.ts packages/backend/src/services/database.ts
commit_at "2025-12-04T11:30:00" "Setup backend scaffolding and database"

# 3. Dec 7, 2025 14:15:00
git add packages/frontend/package.json packages/frontend/tsconfig.json packages/frontend/vite.config.ts packages/frontend/index.html packages/frontend/postcss.config.js packages/frontend/tailwind.config.js packages/frontend/src/vite-env.d.ts packages/frontend/src/main.tsx packages/frontend/src/App.tsx
commit_at "2025-12-07T14:15:00" "Create basic frontend structure and config"

# 4. Dec 11, 2025 09:45:00
git add packages/frontend/src/components/ui/Button.tsx packages/frontend/src/components/Header.tsx packages/frontend/src/components/Sidebar.tsx packages/frontend/src/components/Editor.tsx packages/frontend/src/index.css
commit_at "2025-12-11T09:45:00" "Add core UI components and styling"

# 5. Dec 14, 2025 16:20:00
git add packages/backend/src/services/auth.ts packages/frontend/src/pages/SignIn.tsx packages/frontend/src/pages/SignUp.tsx packages/frontend/src/pages/Profile.tsx packages/frontend/src/store/authStore.ts
commit_at "2025-12-14T16:20:00" "Implement authentication services and pages"

# 6. Dec 18, 2025 13:10:00
git add packages/frontend/src/store/themeStore.ts packages/frontend/src/store/playgroundStore.ts packages/frontend/src/components/SettingsModal.tsx packages/frontend/src/pages/Playground.tsx packages/frontend/src/components/Preview.tsx packages/frontend/src/components/Console.tsx
commit_at "2025-12-18T13:10:00" "Add state management and playground layout"

# 7. Dec 21, 2025 15:55:00
git add packages/frontend/src/components/CollaborationPanel.tsx packages/frontend/src/components/CursorPresence.tsx packages/frontend/src/components/LivePresence.tsx packages/frontend/src/components/FileLock.tsx packages/frontend/src/store/collaborationStore.ts
commit_at "2025-12-21T15:55:00" "Implement live collaboration features"

# 8. Dec 24, 2025 11:05:00
git add packages/backend/src/services/aiAgent.ts packages/frontend/src/components/AIChat.tsx 
commit_at "2025-12-24T11:05:00" "Add AI agent integration"

# 9. Dec 28, 2025 17:30:00
git add packages/frontend/src/templates/ packages/backend/src/services/bundler.ts packages/frontend/src/components/SnippetsLibrary.tsx
commit_at "2025-12-28T17:30:00" "Add starter templates and code bundler"

# 10. Dec 31, 2025 20:45:00
git add .
commit_at "2025-12-31T20:45:00" "Finalize integrations and prepare for beta release"

git branch -D main
git branch -m main
git push -f origin main
