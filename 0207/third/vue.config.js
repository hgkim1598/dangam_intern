module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.0.221:5555",
      },
    },
  },
};
