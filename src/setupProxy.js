const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://169.47.93.83:8082",
      changeOrigin: true,
    })
  );
};
