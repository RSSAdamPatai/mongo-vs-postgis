# mongo-vs-postgis
 
```
npm i
node index.js
```

Postgres table:

```
-- Database: geo_test Table: city

CREATE TABLE city
(
  id serial NOT NULL,
  geom geometry(Point,4326),
  name character varying(128),
  CONSTRAINT city_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE INDEX city_gix
  ON city
  USING gist
  (geom);
```

Export to postgres (into city(id, geom, name) table):
```
sudo -u postgres psql geo_test < query.sql
```

Export to mongo:
```
mongo geo_test --eval "db.city.createIndex( { coord : "2dsphere" } )"
mongo geo_test --eval "db.dropDatabase()" && mongoimport --db geo_test --collection city query.json
```
