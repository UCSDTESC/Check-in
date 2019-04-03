import basic from "./Universities.json";

const alternatives = {
  "The University of California, Berkeley": [
    "UCB",
    "UC Berkeley",
  ],
  "The University of California, Davis": [
    "UCD",
    "UC Davis",
    "UCDavis",
  ],
  "The University of California, Irvine": [
    "UCI",
    "UC Irvine",
  ],
  "The University of California, Los Angeles": [
    "UCLA",
    "UC Los Angeles",
  ],
  "The University of California, Riverside": [
    "UCR",
    "UC Riverside",
  ],
  "The University of California, San Diego": [
    "UCSD",
    "UC San Diego",
  ],
  "The University of California, Santa Barbara": [
    "UCSB",
    "UC Santa Barbara",
  ],
  "The University of California, Santa Cruz": [
    "UCSC",
    "UC Santa Cruz",
  ],
  "The University of California, Merced": [
    "UCM",
    "UC Merced",
  ],
};

export function getSuggestions(text) {
  let trimmed = text.trim();

  let basicRegexp = new RegExp(trimmed, "i");
  let basics = basic.filter(word => word.search(basicRegexp) > -1);

  let alt = Object.keys(alternatives)
    // For each alternative school
    .filter(school =>
      // For each of its alternative names
      alternatives[school].filter(alt =>
        alt.search(basicRegexp) > -1).length > 0
        && basics.indexOf(school) === -1,
    );

  return [
    ...basics,
    ...alt,
  ];
}
