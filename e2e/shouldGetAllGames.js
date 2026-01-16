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

  pm.sendRequest(
    {
      url: `${baseUrl}/games`,
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

        pm.test("Returns games as an array", function () {
          const games = response.json();
          pm.expect(games).to.be.an("array");
        });
      }
    }
  );
}

runTest();
