### Hexlet tests and linter status:
[![Actions Status](https://github.com/Mark-Gruzdov/backend-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Mark-Gruzdov/backend-project-4/actions)
[![Node CI](https://github.com/Mark-Gruzdov/backend-project-4/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Mark-Gruzdov/backend-project-4/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc5da7d86c19fd9e3847/maintainability)](https://codeclimate.com/github/Mark-Gruzdov/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fc5da7d86c19fd9e3847/test_coverage)](https://codeclimate.com/github/Mark-Gruzdov/backend-project-4/test_coverage)

### Page loader

PageLoader – утилита командной строки, которая скачивает страницы из интернета и сохраняет их на компьютере. Вместе со страницей она скачивает все ресурсы (картинки, стили и js) давая возможность открывать страницу без интернета.

Утилита скачивает ресурсы параллельно и показывает прогресс по каждому ресурсу в терминале

Пример использования:

```
  page-loader --output /var/tmp https://ru.hexlet.io/courses

  ✔ https://ru.hexlet.io/courses
  ✔ https://ru.hexlet.io/manifest.json

  Page was successfully loaded into '/var/tmp/ru-hexlet-io-courses.html'
```

### Установка
        
        git clone git@github.com:Mark-Gruzdov/backend-project-4.git
        make install

<!-- DEMO -->

[![asciicast](https://asciinema.org/a/700197.svg)](https://asciinema.org/a/700197)
