const username = process.argv[2];

async function fetchGitHubEvents(username) {
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
  return data;
}

async function mainLogic(){
    const EVENT = await fetchGitHubEvents(username);
    EVENT.map((event) => {
        switch (event.type){
            case "PushEvent":
                let commitLenght = event.payload.commits.length
                console.log(`Pushed ${commitLenght} commits to ${event.repo.name}.`);                
                break;
            case "ForkEvent":
                console.log(`You Forked ${event.repo.name} to ${event.payload.forkee.full_name}.`);
                break;
            case "CreateEvent":
                if(event.payload.ref_type === "repository"){
                    console.log(`You created a new repository: ${event.repo.name}.`);
                }
            default:
                console.log("Some other event");
        }
    })
}

mainLogic()