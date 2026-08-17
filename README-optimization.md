# Оптимізація і ревʼю коду — що в архіві

Розпакувати в корінь чекауту (`~/Projects/ucdi/ukrConsul`), потім запустити
`bash apply-cleanup.sh` — він видалить те, на що в коді немає посилань.

```
cd ~/Projects/ucdi/ukrConsul
unzip -o ~/Downloads/ucdi-optimization.zip -d .
bash apply-cleanup.sh
npm run build
git add -A
git commit -m "Оптимізація ваги, ревʼю коду: витоки, мертвий код, дублювання, дохлі посилання"
git push origin main
```

Після коміту `apply-cleanup.sh` і цей файл можна прибрати — вони не частина
проєкту.
