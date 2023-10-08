const fs = require('fs');
const path = require('path');

console.log('STARTING RENAMING IN ' + __dirname);

const fileExtension = '.png';
const patternStarts = 'enlarge-';
const patternEnds = '-enlarge' + fileExtension;

function renameFile(oldPath, newPath) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.error('ERROR RENAMING ' + oldPath + ': ' + err);
    } else {
      console.log('RENAMED FILE ' + oldPath + ' TO ' + newPath);
    }
  });
}

function processDir(directory) {
  fs.readdir(directory, (err, items) => {
    if (err) {
      console.error('ERROR READING DIRECTORY ' + directory + ': ' + err);
      return;
    }

    items.forEach(item => {
      const itemPath = path.join(directory, item);
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          console.error('ERROR GETTING STATS FOR ' + itemPath + ': ' + err);
          return;
        }

        // If it's a directory, process it recursively
        if (stats.isDirectory()) {
          processDir(itemPath);
        } else if (item.startsWith(patternStarts) && item.endsWith(patternEnds)) {
          const removeStart = item.slice(patternStarts.length);
          const newPath = path.join(directory, removeStart.slice(0, -1 * patternEnds.length) + fileExtension);

          renameFile(itemPath, newPath);
        }
      });
    });
  });
}

// Start processing from the current directory
processDir(__dirname);
