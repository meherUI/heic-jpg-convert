const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

(async () => {
  const inputFolder = 'C:/Users/DELL/Desktop/Opportunity/heic-2';
  const outputFolder = 'C:/Users/DELL/Desktop/Opportunity/ganga-2';

  try {
    // Read the list of files in the input folder
    const files = fs.readdirSync(inputFolder);

    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    for (let idx in files) {
      const file = files[idx];
      if (file.toLowerCase().endsWith('.heic')) {
        const inputFilePath = path.join(inputFolder, file);

        // Read the HEIC file buffer
        const inputBuffer = await promisify(fs.readFile)(inputFilePath);

        // Convert the HEIC file to JPEG
        const images = await convert.all({
          buffer: inputBuffer,
          format: 'JPEG',
        });

        for (let subIdx in images) {
          const image = images[subIdx];

          // Construct the output file name based on the input file name
          const outputFileName = path.parse(file).name + `.-2023.jpg`;
          const outputFilePath = path.join(outputFolder, outputFileName);

          // Write the JPEG file buffer to the output file
          await promisify(fs.writeFile)(outputFilePath, await image.convert());

          console.log('Conversion successful:', outputFilePath);
        }
      }
    }
  } catch (error) {
    console.error('Error converting HEIC files to JPEG:', error.message);
  }
})();
