import axios from 'axios';
import path from 'path';
import { writeFile } from 'fs/promises';

export const getFileName = (url) => {
  const protocol = /^https?:\/\//;
  const unwantedSymbol = /[^A-Za-z0-9]/g;
  const fileName = url
    .replace(protocol, '')
    .replaceAll(unwantedSymbol, '-');
  return `${fileName}.html`;
};

export const pageLoader = async (url, output) => {
  const filePath = path.join(output, getFileName(url));
  const absolutePath = path.resolve(filePath);
  return axios
    .get(url)
    .then(({ data }) => writeFile(absolutePath, data))
    .catch((error) => error)
    .then(() => absolutePath);
};