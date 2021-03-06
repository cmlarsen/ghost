/* eslint no-console: 0 */

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config.js");
const session = require("express-session");

const mainView = require("./routes/index");
const api = require("./routes/api");

const isDeveloping = process.env.NODE_ENV !== "production";
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

//setup ejs views...for now until we have a react app
app.set("views", "views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({ secret: "hotdogs-and-banana-slugs-weiner-dogs-and-chicken-lips" })
);

if (isDeveloping) {
  app.use(express.static("public"));
  app.use("/api", api);
  app.use("/", mainView);
  //this whole section will need to be redone once we have a react app.
  //for now the static routes above are there because the index.html file was
  //clobbering them
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: "src",
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);

  app.use(webpackHotMiddleware(compiler));

  // app.get("*", function response(req, res) {
  //   res.write(
  //     middleware.fileSystem.readFileSync(
  //       path.join(__dirname, "dist/index.html")
  //     )
  //   );
  //   res.end();
  // });
} else {
  // app.use(express.static(__dirname + "/dist"));
  app.use(express.static("public"));
  app.use("/api", api);
  app.use("/", mainView);
  // app.get("*", function response(req, res) {
  //   res.sendFile(path.join(__dirname, "dist/index.html"));
  // });
}

app.listen(port, "0.0.0.0", function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(
    "==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.",
    port,
    port
  );
});
