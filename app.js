//ITE5315--Professor: Shahdad
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const { check, validationResult } = require("express-validator");

const app = express();
const port = process.env.PORT || 3000;

// Set Templating Enginge
const handlebars = require("express-handlebars");
const HBS = handlebars.create({
  //Create custom Helper
  helpers: {
    calculation: function (num) {
      return num + 10;
    },
    strong: function (options) {
      return "<strong>" + options.fn(this) + "</strong>";
    },
  },
  defaultLayout: 'main',
  extname: ".hbs",
});

app.use(express.static(path.join(__dirname + '/public')));
app.engine("hbs", HBS.engine);
app.set("view engine", "hbs");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Navigation
app.get("", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/register",
  urlencodedParser,
  [
    check("username", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())

      const alert = errors.array();
      res.render("register", {
        errs: alert});
    } else
      res.render("output", {
        data: req.body
      });
  }
);

app.listen(port, () => console.info(`App listening on port: ${port}`));
