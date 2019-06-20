import majorList from './Majors.json';

export function getSuggestions(text: string) {
  const caseRegexp = new RegExp(text.trim(), 'i');
  return majorList.filter((word: string) => word.search(caseRegexp) > -1);
}
