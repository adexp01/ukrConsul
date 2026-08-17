#!/usr/bin/env bash
#
# Прибирання зайвих файлів після оптимізації.
#
# Запускати з кореня чекауту: bash apply-cleanup.sh
# Скрипт лише видаляє те, на що в коді немає жодного посилання.
# Нові й змінені файли вже розпаковані з архіву.
#
set -u

if [ ! -d "src" ] || [ ! -f "package.json" ]; then
  echo "Запусти з кореня репозиторію (там, де package.json)." >&2
  exit 1
fi

removed=0

drop() {
  for path in "$@"; do
    if [ -e "$path" ]; then
      rm -rf "$path"
      removed=$((removed + 1))
    fi
  done
}

echo "1/5  Кадри анімації, на які немає посилань у коді (≈82 МБ)"
drop public/animation/frames2 public/animation/frames3

echo "2/5  Шрифти: лишаємо тільки 4 subset.woff2, які підключені (≈4.5 МБ)"
if [ -d public/fonts/fixel-display ]; then
  find public/fonts/fixel-display -type f ! -name '*.subset.woff2' -delete
fi

echo "3/5  Фото команди: PNG замінені на WebP (31.4 МБ → 0.46 МБ)"
drop src/assets/k1.png src/assets/k2.png src/assets/k3.png src/assets/k4.png \
     src/assets/k5.png src/assets/m11.png src/assets/m12.png src/assets/n1.png \
     src/assets/n2.png src/assets/v11.png src/assets/v12.png src/assets/v13.png \
     src/assets/r1.png src/assets/r2.png

echo "4/5  Ассети-сироти (≈6 МБ)"
drop src/assets/partnersRow1.svg src/assets/partnersRow2.svg \
     src/assets/partnersRow1.png src/assets/partnersRow2.png \
     src/assets/comm1.svg src/assets/comm2.svg \
     src/assets/icon4.svg src/assets/icon5.svg \
     src/assets/text.png src/assets/mediaBunner.png src/assets/logo.png \
     src/assets/test.svg src/assets/partners1.svg src/assets/partners2.svg \
     src/assets/fav.svg src/assets/clock.svg src/assets/button-second.svg \
     src/assets/bg7.svg src/assets/bg11.svg src/assets/bg12.svg \
     src/assets/bg13.svg src/assets/bg14.svg src/assets/bg15.svg \
     "src/assets/Vector 5.svg"

echo "5/5  Компоненти, які нікуди не імпортуються"
drop src/components/OurNews src/components/TrackCooperation \
     src/components/UI/ButtonTest src/components/WhatWeDo/icons.jsx \
     src/i18n/LegacyRedirect.jsx

echo
echo "Видалено об'єктів: $removed"
echo
echo "Далі:"
echo "  npm run build   # перевірити, що збирається"
echo "  git add -A && git commit && git push origin main"
