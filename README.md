# Path v3

Toy React project for showing the NJ PATH timetable.

## Run it

Just the frontend:

```
npm start
```

Frontend + backend (needs to build first):

``
npm run build
python main.py
```

## Update data

Get data from https://old.panynj.gov/path/developers.html
Convert `.txt` files (actually CSVs) to `.json` files:

```
# Install Miller
cd public/path-nj-us
for f in *.txt; do
    base=${f%.txt}
    echo "Converting $f -> $base.json"
    mlr --c2j --jlistwrap --jvquoteall cat $f > $base.json
done
```
