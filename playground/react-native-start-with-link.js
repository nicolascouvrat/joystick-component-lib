/**
 * - check symlink in depencency and devDepency
 * - if found, generate rn-cli-config.js
 * - react-native start with rn-cli-config
 */

const packageJson = require('./package.json');
const appJson = require('./app.json');
const fs = require('fs');
const exec = require('child_process').execSync;
const RN_CLI_CONFIG_NAME = `rn-cli-config-with-links.js`;

main();

function main() {
  const deps = Object.keys(
    Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
  );

  const symlinkPathes = getSymlinkPathes(deps);
  generateRnCliConfig(symlinkPathes, RN_CLI_CONFIG_NAME);
  generateExpoConfig();
  runBundlerWithConfig(RN_CLI_CONFIG_NAME);
}

function getSymlinkPathes(deps) {
  const depLinks = [];
  const depPathes = [];
  deps.forEach(dep => {
    const stat = fs.lstatSync('node_modules/' + dep);
    if (stat.isSymbolicLink()) {
      depLinks.push(dep);
      depPathes.push(fs.realpathSync('node_modules/' + dep));
    }
  });

  console.log('Starting react native with symlink modules:');
  console.log(
    depLinks.map((link, i) => '   ' + link + ' -> ' + depPathes[i]).join('\n')
  );

  return depPathes;
}

function generateRnCliConfig(symlinkPathes, configName) {
  const fileBody = `
var path = require('path');
var blacklist = require('metro-bundler/src/blacklist');

var config = {
  extraNodeModules: {
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getBlacklistRE() {
    return blacklist([
      ${symlinkPathes.map(
        path =>
          `/${path.replace(
            /\//g,
            '[/\\\\]'
          )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`
      )}
    ]);
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      ${symlinkPathes.map(path => `path.resolve('${path}')`)}
    ];
  }
};
module.exports = config;
  `;

  fs.writeFileSync(configName, fileBody);
}

function generateExpoConfig() {
  const packagerOpts = {
    projectRoots: "",
    assetExts: ["ttf"],
    config: RN_CLI_CONFIG_NAME
  };
  appJson.expo.packagerOpts = packagerOpts;
  const fileBody = JSON.stringify(appJson);
  fs.writeFileSync('app.json', fileBody);
}

function runBundlerWithConfig(configName) {
  // exec(
  //   `node node_modules/react-native/local-cli/cli.js start --config ../../../../${configName}`,
  //   { stdio: [0, 1, 2] }
  // );
  exec(
    `yarn start`,
    { stdio: [0, 1, 2] }
  );
}
