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

async function runTest() {
  await createUsers();
  console.log("Users created");

  pm.sendRequest(
    {
      url: `${baseUrl}/users`,
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

        pm.test("Returns users as an array", function () {
          const users = response.json();
          pm.expect(users).to.be.an("array");
        });
      }
    }
  );
}

runTest();
