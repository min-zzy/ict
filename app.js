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
var context = 'projects/cookingchatbot/agent/sessions/5bd81f18-c941-4a8c-9e61-1b9be8c5ab20/contexts/cookingstep1-followup';
var i=0

const server = app.listen(
  PORT,
  console.log(
    `Server is runnig on ${process.env.NODE_ENV} mode at port ${PORT} with ${process.env.PROJECT_ID}`.yellow
      .bold
  )
);
console.log(context)
const io = socketio(server);
io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("chat message", (message) => {
    console.log(message);
    const sessionId = uuid.v4();
    const callapibot = async (projectId = process.env.PROJECT_ID) => {
      try {
        
        const sessionClient = new dialogflow.SessionsClient({
          keyFilename: "./cookingchatbot-ee82511365a7.json",
        });
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
        var context = 'projects/cookingchatbot/agent/sessions/5bd81f18-c941-4a8c-9e61-1b9be8c5ab20/contexts/cookingstep'+String(i)+'-followup';
        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: "ko-KR",
            },
          },
          
          queryParams: {
            contexts: [
            {
            "name": context,
            "lifespanCount": 9
            },
            ]
            },
        };
        const responses = await sessionClient.detectIntent(request);

        console.log("Detected intent");
        console.log(context)
        const result = responses[0].queryResult.fulfillmentText;
        var context = responses[0].queryResult.outputContexts[0].name;
        socket.emit("bot reply", result);
        console.log(result);
        console.log(context);
        if (context.indexOf('cookingstep') != -1) {
          i += 1
        }
        
        console.log(i)
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
