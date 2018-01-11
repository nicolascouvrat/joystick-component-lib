
var path = require('path');
var blacklist = require('metro-bundler/src/blacklist');

var config = {
  extraNodeModules: {
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getBlacklistRE() {
    return blacklist([
      /[/\\]home[/\\]nicolas[/\\]personal_projects[/\\]react_stuff[/\\]joystick-component-lib[/\\]node_modules[/\\]react-native[/\\].*/
    ]);
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      path.resolve('/home/nicolas/personal_projects/react_stuff/joystick-component-lib')
    ];
  }
};
module.exports = config;
  