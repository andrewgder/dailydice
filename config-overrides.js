module.exports = function override(config, env) {
  config.resolve.fallback = {
    path: false, // Ignore 'path' module
    crypto: false,
    os: false,
  };
  return config;
};
