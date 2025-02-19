const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@mini": path.resolve(__dirname, "./src/mini"),
    },
  },
};
