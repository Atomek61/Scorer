copy %1.tmpl.svg %1.%2.svg
ssr -f %1.%2.svg -a --no-backup -s #dddddd -r %3
ssr -f %1.%2.svg -a --no-backup -s #888888 -r %4
ssr -f %1.%2.svg -a --no-backup -s #333333 -r %5
move %1.%2.svg ..\img