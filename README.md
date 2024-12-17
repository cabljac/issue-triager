# GitHub Issues Fetcher

A simple Bun script to fetch GitHub issues with specific labels and save them as JSON.

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- GitHub Personal Access Token with repo access

## Setup

1. Clone this repository and install dependencies:
```bash
git clone <repository-url>
cd github-issues-fetcher
bun install
```

2. Create a `.env` file in the project root with the following variables:
```
OWNER=your-github-username-or-org
REPO=your-repository-name
GITHUB_PAT=your-github-personal-access-token
LABEL=desired-issue-label
LIMIT=10  # Optional: number of most recent issues to fetch
```

## Environment Variables

- `OWNER`: GitHub username or organization name
- `REPO`: Repository name
- `GITHUB_PAT`: GitHub Personal Access Token
- `LABEL`: Label to filter issues by
- `LIMIT`: (Optional) Maximum number of issues to fetch. If not provided, fetches all matching issues

## Usage

Run the script:
```bash
bun run index.ts
```

The script will:
1. Fetch open GitHub issues with the specified label
2. Save them to `issues.json` in the current directory
3. Include the following information for each issue:
   - Issue number
   - Issue URL
   - Title
   - Body
   - Labels

## Output Format

The script generates a JSON file with the following structure:
```json
[
  {
    "number": 123,
    "url": "https://github.com/owner/repo/issues/123",
    "title": "Issue title",
    "body": "Issue description",
    "labels": ["label1", "label2"]
  },
  // ...
]
```

## Error Handling

The script will:
- Validate all required environment variables
- Handle GitHub API pagination
- Display clear error messages for common issues
- Exit with status code 1 on errors

## License

MIT