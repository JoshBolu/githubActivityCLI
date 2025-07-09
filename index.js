const { writeFileSync, readFileSync, existsSync } = require("fs"); //to read,write and check if file already exists
const path = require("path"); // to make sure the file doesn't break when working on another machine

const username = process.argv[2];

const filePath = path.join(__dirname, "cache", `${username}.json`);
console.log(filePath);

async function fetchGitHubEvents(username, filePath) {
  try {
    // Check if the cache file exists
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, "utf-8"));
    } 

    // If the cache file does not exist, fetch data from GitHub API
    else {
      // Check if username is provided
      if (!username) {
        throw new Error("Please provide a GitHub username as an argument.");
      }
      // Fetch data from GitHub API
      const response = await fetch(
        `https://api.github.com/users/${username}/events?per_page=7`,
        {
          headers: {
            "User-Agent": "Node.js",
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const data = await response.json();
      // Write the fetched data to the cache file
      writeFileSync(filePath, JSON.stringify(data));

      // checks if the response is ok or not
      if (!response.ok) {
        // Handle specific HTTP errors
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
    }  
  } 
  catch (error) {
    console.error(`Error fetching data: ${error}`);
    return []; // Return an empty array on error
  }
}

async function mainLogic() {
  try {
    const EVENT = await fetchGitHubEvents(username, filePath);
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
            console.log(
              `you created a new branch: ${event.payload.ref} on ${event.repo.name}.`
            );
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
    console.error(`Error occured getting data : ${error}`);
    console.log("Try again");
  }
}

mainLogic();
