# GitHub User Activity CLI

A simple Node.js command-line tool to fetch and display 7 most recent GitHub activity events for a specified user.

## Features

- Fetches recent public events for any GitHub user.
- Displays activity such as pushes, forks, repository/branch creation, deletions, pull requests, and issue comments.
- Handles API errors and rate limits gracefully.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository or download the source code.

### Usage

Run the CLI tool with a GitHub username as an argument:

```sh
node index.js <github-username>
```

**Example:**
```sh
node index.js octocat
```

## Example Output

```
Pushed 2 commits to octocat/Hello-World.
You Forked octocat/Hello-World to octocat/Hello-World-Fork.
You created a new repository: octocat/New-Repo.
You deleted octocat/Old-Repo from branch: main.
You opened a pull request on octocat/Hello-World with the title: "Fix bug" and performed a "opened" action.
You commented on a issue in octocat/Hello-World with the title: "Bug report" and number: 42.
```

## Notes

- The tool uses the public GitHub API and may be subject to rate limits.
- For higher rate limits, consider using a GitHub authentication token (not yet implemented).
- A cache mechanism is planned for future versions.

## License

MIT License

---

**Author:**  
Boluwatife Suyi-Ajayi Joshua  
**Project URL**
https://roadmap.sh/projects/github-user-activity
