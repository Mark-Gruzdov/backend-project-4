import os from 'os';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import {
  test, expect, beforeEach,
} from '@jest/globals';
import { 
  getHtmlFileName, getImageFileName, getFolderName, getAbsolutePath, pageLoader
} from '../src/pageLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

const mockUrl = 'https://ru.hexlet.io';
const expectedHtmlFileName = 'ru-hexlet-io-courses.html';
const expectedImageFileName = 'ru-hexlet-io-assets-professions-nodejs.png';
const mockImgPath = getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png');
let tempDir;
let originHtmlFile;
let mockData

beforeAll(async () => {
  originHtmlFile = await readFile(getFixturePath('origin.html'), 'utf-8');
  mockData = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
});

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  nock(mockUrl)
    .get('/courses')
    .reply(200, originHtmlFile)
    .get('/assets/professions/nodejs.png')
    .replyWithFile(200, mockImgPath);
});

test('html data is correcly loaded', async () => {
  const filePath = await pageLoader(`${mockUrl}/courses`, tempDir);
  console.log(`filepath >>> ${filePath}`);
  await expect(readFile(filePath, 'utf-8')).resolves.toEqual(mockData);
});

test('html fileName is correctly created', async () => {
  await expect(getHtmlFileName(`${mockUrl}/courses`)).toEqual(expectedHtmlFileName);
});

test('image fileName is correctly created', async () => {
  const formattedMockUrl = mockUrl
    .replace(/^https?:\/\//, '')
    .replace(/\./g,'-');
  const imagePath = `${formattedMockUrl}/assets/professions/nodejs.png`
  await expect(getImageFileName(imagePath)).toEqual(expectedImageFileName);
});

test('images folder is correctly created', async () => {
  const resultPath = await pageLoader(mockUrl, tempDir);
  const filePath = getAbsolutePath(path.join(tempDir, getFolderName(resultPath)));
  await expect((await stat(filePath)).isDirectory()).toBe(true);
});