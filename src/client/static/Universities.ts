import basic from './Universities.json';

interface AlternativeMap {
  [fullUniversityName: string]: string[];
}

const alternatives: AlternativeMap = {
  'The University of California, Berkeley': [
    'UCB',
    'UC Berkeley',
  ],
  'The University of California, Davis': [
    'UCD',
    'UC Davis',
    'UCDavis',
  ],
  'The University of California, Irvine': [
    'UCI',
    'UC Irvine',
  ],
  'The University of California, Los Angeles': [
    'UCLA',
    'UC Los Angeles',
  ],
  'The University of California, Riverside': [
    'UCR',
    'UC Riverside',
  ],
  'The University of California, San Diego': [
    'UCSD',
    'UC San Diego',
  ],
  'The University of California, Santa Barbara': [
    'UCSB',
    'UC Santa Barbara',
  ],
  'The University of California, Santa Cruz': [
    'UCSC',
    'UC Santa Cruz',
  ],
  'The University of California, Merced': [
    'UCM',
    'UC Merced',
  ],
};

export function getSuggestions(text: string) {
  const trimmed = text.trim();

  const basicRegexp = new RegExp(trimmed, 'i');
  const basics = basic.filter((word: string) => word.search(basicRegexp) > -1);

  const alt = Object.keys(alternatives)
    // For each alternative school
    .filter(school =>
      // For each of its alternative names
      alternatives[school].filter((alt: string) =>
        alt.search(basicRegexp) > -1).length > 0
        && basics.indexOf(school) === -1,
    );

  return [
    ...basics,
    ...alt,
  ];
}
