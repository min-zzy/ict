require("dotenv").config(); 

const path = require("path");
const express = require("express");
const colors = require("colors");
//const dotenv = require("dotenv");
const socketio = require("socket.io");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const app = express();

require("dotenv").config(); 
console.log("Project ID :", process.env.PROJECT_ID)
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const projectId = 'cookingchatbot'
const server = app.listen(
  PORT,
  console.log(
    `Server is runnig on ${process.env.NODE_ENV} mode at port ${PORT} with ${process.env.PROJECT_ID}`.yellow
      .bold
  )
);

const io = socketio(server);
io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("chat message", (message) => {
    console.log(message);

    const callapibot = async (projectId = process.env.PROJECT_ID) => {
      try {
        const sessionId = uuid.v4();
        const sessionClient = new dialogflow.SessionsClient({
          keyFilename: "./cookingchatbot-ee82511365a7.json",
        });
        const sessionPath = sessionClient.projectAgentSessionPath(
          projectId,
          sessionId
        );
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: "ko-KR",
            },
          },
        };
        const responses = await sessionClient.detectIntent(request);

        console.log("Detected intent");
        const result = responses[0].queryResult.fulfillmentText;
        socket.emit("bot reply", result);
        console.log(result);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
        } else {
          console.log(`  No intent matched.`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    callapibot();
  });
});
