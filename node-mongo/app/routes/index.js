const app = (module.exports = require("express")());
const auth = require("../controllers/auth.controller.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");

// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the beginning of nothingness" });
});

app.use("/api/docs", swaggerUi.serve);
app.get("/api/docs", swaggerUi.setup(swaggerDocument));
// Retrieve all Notes
app.post("/api/login", auth.login);
app.post("/api/register", auth.register);
app.use("/api/notes", require("./note.routes")); // notes routes
app.use("/api/users", require("./user.routes")); // notes routes
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
