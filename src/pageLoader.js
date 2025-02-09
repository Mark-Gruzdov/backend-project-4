import axios from 'axios';
import path from 'path';
import prettier from 'prettier';
import * as cheerio from 'cheerio';
import { writeFile, mkdir, stat } from 'fs/promises';

export const getHtmlFileName = (url) => {
  const protocol = /^https?:\/\//;
  const unwantedSymbol = /[^A-Za-z0-9]/g;
  const fileName = url
    .replace(protocol, '')
    .replaceAll(unwantedSymbol, '-');
  return `${fileName}.html`;
};

export const getImageFileName = (url) => {
  const formatName = (str) => str.replace(/\//g, '-');
  return url.pathname ? formatName(url.pathname) : formatName(url);
};

export const getFolderName = (pathFile) => {
  const { name } = path.parse(pathFile);
  return `${name}_files`;
};

export const getAbsolutePath = (pathFile) => path.resolve(pathFile);


export const pageLoader = async (url, output) => {
  const pageUrl = new URL(url);
  const htmlFileName = getHtmlFileName(url);
  const absolutePath = getAbsolutePath(path.join(output, htmlFileName));
  const folderName = getFolderName(absolutePath);
  const pathFolder = getAbsolutePath(path.join(output, folderName));
  let htmlResult;
  let imgTags;
  const imageLinks = []
  return axios
    .get(url)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      imgTags = $('img');
      imgTags.each(function getImageLinks() {
        imageLinks.push($(this).attr('src'));
      });
      htmlResult = $;
    })
    .then(() => stat(pathFolder))
    .catch(() => mkdir(pathFolder, { recursive: true }))
    .then(() => imageLinks.map((link) => {
      const imageUrl = link.startsWith('http') ? new URL(link) : link;
      const downloadImgUrl = link.startsWith('http')
        ? `${imageUrl.origin}${imageUrl.pathname}`
        : `${pageUrl.origin}${imageUrl}`;
      const localImageLink = `${folderName}/${pageUrl.hostname.replace(/\./g, '-')}${getImageFileName(imageUrl)}`;
      const absolutePathImage = getAbsolutePath(path.join(output, localImageLink));
      axios({
        method: 'get',
        url: downloadImgUrl,
        responseType: 'stream',
      })
        .catch((error) => error)
        .then(({ data }) => writeFile(absolutePathImage, data));
      return localImageLink;
    }))
    .catch((error) => error)
    .then((localImageLinks) => {
      imgTags.each((index, element) => {
        const imgElement = htmlResult(element);
        const localLink = localImageLinks[index];
        imgElement.attr('src', localLink);
      });
      return htmlResult.html();
    })
    .then((data) => prettier.format(data, { parser: 'html' }))
    .then((formatedHtml) => formatedHtml.trim())
    .then((formatedHtml) => writeFile(absolutePath, formatedHtml))
    .catch((error) => error)
    .then(() => absolutePath);
};