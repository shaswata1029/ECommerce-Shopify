const { createProxyMiddleware } = require("http-proxy-middleware");
const developmentServerLink = "http://localhost:8000/";
// const productionServerLink = ""

module.exports = function (app) {
  app.use(
    "/api/v1/*",
    createProxyMiddleware({
      target: developmentServerLink,
      changeOrigin: true,
    })
  );
};
