const fs = require("fs");
const { performance } = require("perf_hooks");

// read the given input files
const text = fs.readFileSync("./t8.shakespeare.txt", "utf-8");
const findWords = fs.readFileSync("./find_words.txt", "utf-8");
const dictionary = fs.readFileSync("./french_dictionary.csv", "utf-8");

// Create a map where English Word is the key and Frentch Word is a value
const lookup = {};
const dictLines = dictionary.trim().split("\n");
for (let i = 1; i < dictLines.length; i++) {
  const [english, frequency] = dictLines[i].split(",");
  lookup[english] = frequency;
}

// Split the find-word file with every single line
const findWordsList = findWords.trim().split("\n");

// replace words in text
let replacedWords = {};
const translatedText = text.replace(/\b\w+\b/g, (match) => {
  if (findWordsList.includes(match) && lookup[match]) {
    replacedWords[match] = replacedWords[match] ? replacedWords[match] + 1 : 1;
    return lookup[match];
  }
  return match;
});
console.log(replacedWords);


// write output in t8.shakespeare.translated.txt files
fs.writeFileSync("./t8.shakespeare.translated.txt", translatedText);

// write English word, French word, Frequency in Frequency.csv file

const frequency = Object.entries(replacedWords)
  .map(([english, count]) => [english, lookup[english], count])
  .join("\n");

fs.writeFileSync(
  "./frequency.csv",
  "English word,French word,Frequency\n" + frequency
);

const timeElapsed = performance.now();
const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
fs.writeFileSync(
  "./performance.txt",
  `Time to process: ${timeElapsed} ms\nMemory used: ${memoryUsed.toFixed(2)} MB`
);

fs.writeFileSync(
  "./githublink.txt",
  "https://github.com/yourusername/your-repo-name"
);
