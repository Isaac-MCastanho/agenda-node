const route = require("express").Router();

const homeController = require("./src/controllers/homeController");

route.get("/", homeController.paginaInicial);

module.exports = route;
