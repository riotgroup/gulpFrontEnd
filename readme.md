# Сборка FrontEnd

Набор для верстки FrontEnd'a, для установки перейдите в каталог
с архивом и выполните команду `npm install` - на этом процесс
установки закончен.

## Gulpfile.js

**js:build** - Соберет все JS файлы (создайте точку входа скрипта `app-source/app-scripts/app.js`)
**styles:build** - Соберет стили
**image:build** - Соберет и сожмет изображения
**sprite:build** - Создаст спрайт из файлов. Загрузите файлы для сборки в `app-source/app-sprite`, получите готовый файл в каталоге со всеми изображениями.
                   Подключите файл стилей `app-source/app-stylesheets/sprite.scss` в сборку.
**fonts:build** - Скопирует шрифты
**html:build** - Соберет шаблон (с использованием rigger'a для include файлов, например `//= Partials/menu.html`)
**twig:build** - Соберет шаблон из twig
**server** - Запустит сервер `http://localhost:8080`
**build** - Запустит все команды сборки: js:build, image:build, sprite:build, styles:build, fonts:build, html:build, twig:build.
**watch** - Слежение за изменениями.
**default** - Запустит сначала `build`, а после слежение `watch`.
