<!DOCTYPE html>
<html lang="ru">
  <head>
      <title>SPMap</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta charset="utf-8"/>
      <style>
          html, body, .map {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
          }
      </style>
      <link rel="stylesheet" href="<?php print drupal_get_path('module', 'gmap') . '/static/spmap.css' ?>"/>
      <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&coordorder=longlat"></script>
  </head>
  <body>
    <div id="content" class="map"></div>
    <script src="<?php print drupal_get_path('module', 'gmap') . '/static/spmap.js' ?>"></script>
  </body>
</html>
