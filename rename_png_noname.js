const fs = require('fs');
const path = require('path');

console.log('STARTING RENAMING IN ' + __dirname);

const fileExtension = '.png';
const pngFirstBytes = [137, 80, 78, 71, 13, 10, 26, 10];

function isPng(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(8); // We only need the first 8 bytes to determine PNG signature
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);

  // PNG file signature
  return buffer.equals(pngFirstBytes);
}

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
        } else if (item.indexOf('.') === -1 && isPng(itemPath)) {
          const newPath = path.join(directory, item + fileExtension);
          renameFile(itemPath, newPath);
        }
      });
    });
  });
}

// Start processing from the current directory
processDir(__dirname);
