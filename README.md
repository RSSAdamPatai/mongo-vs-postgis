# mongo-vs-postgis
 
```
npm i
node index.js
```

Export to postgres (into city(id, geom, name) table):
```
sudo -u postgres psql geo_test < query.sql
```

Export to mongo:
```
mongo geo_test --eval "db.dropDatabase()" && mongoimport --db geo_test --collection city query.json
```
