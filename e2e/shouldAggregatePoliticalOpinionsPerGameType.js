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
  {
    age: 22,
    sex: "M",
    job: "Student",
    politicalOpinion: "Reconquête",
    nationality: "French",
    favoriteGames: ["Game1"],
  },
  {
    age: 28,
    sex: "F",
    job: "Teacher",
    politicalOpinion: "Ecologie Les Verts",
    nationality: "French",
    favoriteGames: ["Game2"],
  },
  {
    age: 35,
    sex: "M",
    job: "Doctor",
    politicalOpinion: "Reconquête",
    nationality: "French",
    favoriteGames: ["Game2", "Game1"],
  },
  {
    age: 40,
    sex: "F",
    job: "Lawyer",
    politicalOpinion: "Ecologie Les Verts",
    nationality: "French",
    favoriteGames: ["Game1"],
  },
  {
    age: 27,
    sex: "M",
    job: "Artist",
    politicalOpinion: "RN",
    nationality: "French",
    favoriteGames: ["Game2", "Game1"],
  },
  {
    age: 32,
    sex: "F",
    job: "Engineer",
    politicalOpinion: "LFI",
    nationality: "French",
    favoriteGames: ["Game2"],
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
      url: `${baseUrl}/data/game-type/Test1`,
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

        pm.test("Returns correct political opinions", function () {
          const opinions = response.json();
          pm.expect(opinions).to.be.an("array");
          pm.expect(opinions).to.have.lengthOf(3);
          pm.expect(opinions).to.include("Reconquête");
          pm.expect(opinions).to.include("RN");
          pm.expect(opinions).to.include("Ecologie Les Verts");
        });
      }
    }
  );
}

runTest();
