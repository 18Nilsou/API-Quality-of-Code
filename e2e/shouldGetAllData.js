const users = [
  {
    age: 25,
    sex: "M",
    job: "Engineer",
    politicalOpinion: "Reconquête",
    nationality: "French",
    favoriteGames: ["Game1", "Game2"],
  },
  {
    age: 30,
    sex: "F",
    job: "Unemployed",
    politicalOpinion: "RN",
    nationality: "French",
    favoriteGames: ["Game1"],
  },
];

const games = [
  {
    pegi: 18,
    name: "Game1",
    type: "Test1",
    indie: true,
    multiplayer: false,
    competitive: true,
  },
  {
    pegi: 12,
    name: "Game2",
    type: "Test2",
    indie: false,
    multiplayer: true,
    competitive: false,
  },
];

const baseUrl = "http://localhost:3000";

async function createUsers() {
  for (const user of users) {
    await pm.sendRequest({
      url: `${baseUrl}/users`,
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: {
        mode: "raw",
        raw: JSON.stringify(user),
      },
    });
  }
}

async function createGames() {
  for (const game of games) {
    await pm.sendRequest({
      url: `${baseUrl}/games`,
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: {
        mode: "raw",
        raw: JSON.stringify(game),
      },
    });
  }
}

async function runTest() {
  await createGames();
  console.log("Games created");

  await createUsers();
  console.log("Users created");

  pm.sendRequest(
    {
      url: `${baseUrl}/data`,
      method: "GET",
    },
    function (err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log("Response:", response.json());

        pm.test("Status code is 200", function () {
          pm.expect(response.code).to.equal(200);
        });

        pm.test("Returns correct data", function () {
          const data = response.json();
          pm.expect(data).to.be.an("object");
          pm.expect(data).to.have.property("users");
          pm.expect(data.users).to.be.an("array");
          pm.expect(data).to.have.property("games");
          pm.expect(data.games).to.be.an("array");
        });
      }
    }
  );
}

runTest();
