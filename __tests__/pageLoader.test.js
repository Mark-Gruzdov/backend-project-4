import os from 'os';
import path from 'path';
import nock from 'nock';
import { mkdtemp, readFile } from 'node:fs/promises';
import {
  test, expect, beforeEach,
} from '@jest/globals';
import { getFileName, pageLoader } from '../src/pageLoader.js';

nock.disableNetConnect();
const mockUrl = 'https://ru.hexlet.io';
const expectedFileName = 'ru-hexlet-io.html';
const mockData = '<!DOCTYPE html><html><head></head><body></body></html>';
let tempDir;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('data is correcly loaded', async () => {
  nock(mockUrl)
    .get('/')
    .reply(200, mockData);
  const filePath = await pageLoader(mockUrl, tempDir);
  await expect(readFile(filePath, 'utf-8')).resolves.toEqual(mockData);
});

test('fileName is correctly created', async () => {
  nock(mockUrl)
    .get('/')
    .reply(200, mockData);
  await expect(getFileName(mockUrl)).toEqual(expectedFileName);
});