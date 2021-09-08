const { initializeDbConnection } = require("./db/db.connection");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { userRouter } = require("./routers/user.router");
const { routeNotFound } = require("./middlewares/route-not-found.middleware");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const { login } = require("./controllers/auth.controller");
const { loginHandler } = require("./middlewares/login.middleware");
const { paymentRouter } = require("./routers/payment.router");
const { productRouter } = require("./routers/product.router");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

initializeDbConnection();

app.use("/payment", paymentRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/login", loginHandler, login);

// NOTE: Do not move
app.use("*", routeNotFound);
app.use(errorHandler);

app.listen(process.env.PORT || PORT, () =>
  console.log(`The server is running at port ${process.env.PORT || PORT}`)
);
