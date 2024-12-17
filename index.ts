// Validate environment variables
const OWNER = Bun.env.OWNER;
const REPO = Bun.env.REPO;
const GITHUB_PAT = Bun.env.GITHUB_PAT;
const LABEL = Bun.env.LABEL;
const LIMIT = parseInt(Bun.env.LIMIT || "Infinity");

console.log("Environment variables loaded:", {
  OWNER: Bun.env.OWNER,
  REPO: Bun.env.REPO,
  GITHUB_PAT: Bun.env.GITHUB_PAT?.slice(0, 4) + "...",
  LABEL: Bun.env.LABEL,
  LIMIT: isFinite(LIMIT) ? LIMIT : "no limit",
});

if (!OWNER || !REPO || !GITHUB_PAT || !LABEL) {
  console.error(
    "Missing required environment variables: OWNER, REPO, GITHUB_PAT, LABEL"
  );
  process.exit(1);
}

async function fetchIssues() {
  let page = 1;
  let allIssues = [];

  while (true) {
    // If we've reached the limit, stop fetching
    if (allIssues.length >= LIMIT) {
      allIssues = allIssues.slice(0, LIMIT);
      break;
    }

    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&labels=${LABEL}&page=${page}&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${GITHUB_PAT}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const issues = await response.json();

    // Break if no more issues
    if (issues.length === 0) break;

    // Map to only include required fields
    const simplifiedIssues = issues.map((issue) => ({
      number: issue.number,
      url: issue.html_url,
      title: issue.title,
      body: issue.body,
      labels: issue.labels.map((label) => label.name),
    }));

    allIssues = [...allIssues, ...simplifiedIssues];
    page++;
  }

  return allIssues;
}

try {
  const limitStr = isFinite(LIMIT) ? `up to ${LIMIT}` : "all";
  console.log(
    `Fetching ${limitStr} open issues from ${OWNER}/${REPO} with label: ${LABEL}`
  );
  const issues = await fetchIssues();

  // Write to issues.json in the current directory
  await Bun.write("issues.json", JSON.stringify(issues, null, 2));

  console.log(
    `Successfully fetched ${issues.length} open issues and saved to issues.json`
  );
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
