const CACHE_PREFIX = `taskmanager-cache`;
const VERSION = `v1`;
const CACH_NAME = `${CACHE_PREFIX}-${VERSION}`;

const putIntoCache = (request, response) => {
  caches.open(CACH_NAME)
    .then((cache) => {
      cache.put(request, response);
    });
};

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACH_NAME)
      .then((cache) => {
        // Записываем в кэш все статические ресурсы
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/normalize.css`,
          `/css/style.css`,
          `/fonts/HelveticaNeueCyr-Bold.woff`,
          `/fonts/HelveticaNeueCyr-Bold.woff2`,
          `/fonts/HelveticaNeueCyr-Medium.woff`,
          `/fonts/HelveticaNeueCyr-Medium.woff2`,
          `/fonts/HelveticaNeueCyr-Roman.woff`,
          `/fonts/HelveticaNeueCyr-Roman.woff2`,
          `/img/add-photo.svg`,
          `/img/close.svg`,
          `/img/sample-img.jpg`,
          `/img/wave.svg`
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      // Получаем названия всех кэшей
      caches.keys()
        // Перебираем все ключи и составляем набор промисов на удаление
        .then((keys) => Promise.all(
            keys.map((key) => {
              // Удаляем те кэши, которые начинаются с нужного префикса, но не совпадают по версии
              if (key.startsWith(CACHE_PREFIX) && key !== CACH_NAME) {
                return caches.delete(key);
              }
              // Все остальные не обрабатываем
              return null;
            })
            .filter((key) => key !== null)
        ))
  );
});


self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
      .then((cacheResponse) => {
        // Если в кэше нашелся ответ на request, возвращаем его вместо запроса на сервер
        if (cacheResponse) {
          return cacheResponse;
        }
        // Если в кэше ответа нет, повторно создаем fetch с тем же запросом request
        return fetch(request)
          .then((response) => {
            // Если ответ не со статусом 200, не безопасного типа(basic), просто передаем его дальше, не обрабатываем
            if (!response || response.status !== 200 || response.type !== `basic`) {
              return response;
            }
            // Если ответ удовлетворяет всем условиям, клонируем его и сохраняем его в кэше, сам response - возвращаем
            const clonedResponse = response.clone();
            putIntoCache(request, clonedResponse);
            return response;
          });
      })
  );
});
