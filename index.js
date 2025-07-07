const username = process.argv[2];

// TODO add Cache mechanism

async function fetchGitHubEvents(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`,
      {
        headers: {
          "User-Agent": "Node.js",
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found`);
      } else if (response.status === 403) {
        throw new Error(
          "API rate limit exceeded. Consider using an authentication token."
        );
      } else {
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`
        );
      }
    }
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return []; // Return an empty array on error
  }
}

async function mainLogic() {
  try {
    const EVENT = await fetchGitHubEvents(username);
    // console.log(EVENT[7]);

    EVENT.map((event) => {
      switch (event.type) {
        case "PushEvent":
          let commitLenght = event.payload.commits.length;
          console.log(`Pushed ${commitLenght} commits to ${event.repo.name}.`);
          break;
        case "ForkEvent":
          console.log(
            `You Forked ${event.repo.name} to ${event.payload.forkee.full_name}.`
          );
          break;
        case "CreateEvent":
          if (event.payload.ref_type === "repository") {
            console.log(`You created a new repository: ${event.repo.name}.`);
          } else if (event.payload.ref_type === "branch") {
            console.log(`you created a new branch: ${event.payload.ref} on ${event.repo.name}.`);
          } else {
            console.log(
              `you've made a new tag on ${event.repo.name} on the ${event.payload.master_branch} branch`
            );
          }
          break;
        case "DeleteEvent":
          console.log(
            `You deleted ${event.repo.name} from branch: ${event.payload.ref}.`
          );
          break;
        case "PullRequestEvent":
          console.log(
            `You opened a pull request on ${event.repo.name} with the title: ${event.payload.pull_request.title} and performed a "${event.payload.action}" action.`
          );
          break;
        case "IssueCommentEvent":
          console.log(
            `You commented on a issue in ${event.repo.name} with the title: ${event.payload.issue.title} and number: ${event.payload.issue.number}.`
          );
          break;
        default:
          console.log(`Event type ${event.type} is not handled.`);
      }
    });
  } catch (error) {
    console.error(`Error occured while fetching: ${error}`);
    console.log("Try again");
  }
}

mainLogic();