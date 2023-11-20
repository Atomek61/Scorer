copy %1.svg ..\img\%2.%1.svg
ssr -f ..\img\%2.%1.svg -a --no-backup -s #444444 -r %3
ssr -f ..\img\%2.%1.svg -a --no-backup -s #cccccc -r %4
