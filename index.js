var ROWS = 1000000;

var fs = require('fs');
var random = require('geojson-random').point(ROWS, [0.0, 0.0, 180.0, 90.0]);

//db: geo_test ; table: city
//sudo -u postgres psql geo_test < query.sql
function genP(file) {
  //Clear file
  fs.writeFileSync(file, 'DELETE FROM city;\n');
  var s = 'INSERT INTO city (geom, name) VALUES (ST_GeomFromText(\'POINT(0 0)\', 4326), \'origo\')';
  for (var i = 0; i < random.features.length; i++) {
    var f = random.features[i];
    var p = f.geometry;
    p.crs = {"type": "name", "properties": {"name": "EPSG:4326"}};

    s += '\n,(ST_GeomFromGeoJSON(\'' + JSON.stringify(p) + '\'), \'city-' + p.coordinates + '\')';
    if (s.length > 100000) {
      console.log('Postgres: ' + i);
      fs.appendFileSync(file, s);
      s = '';
    }

    if((i+1)%(ROWS/1000)===0){
      i++;
      if(i>=random.features.length){
        break;
      }
      fs.appendFileSync(file, s+';');
      f = random.features[i];
      p = f.geometry;
      p.crs = {"type": "name", "properties": {"name": "EPSG:4326"}};
      s = 'INSERT INTO city (geom, name) VALUES (ST_GeomFromGeoJSON(\'' + JSON.stringify(p) + '\'), \'city-' + p.coordinates + '\')'
    }
  }
  fs.appendFileSync(file, s+';');
}


// mongo geo_test --eval "db.dropDatabase()" && mongoimport --db geo_test --collection city query.json
function genM(file) {
  fs.writeFileSync(file, '');
  var s = '{ "coord" : {"type":"Point","coordinates":[0,0]}, "name": "origo"}';
  random.features.map(function (f, i) {
    var p = f.geometry;
    s += '\n{ "coord" : ' + JSON.stringify(p) + ', "name": "city-' + p.coordinates + '"}';
    if (s.length > 100000) {
      console.log('Mongo: ' + i);
      fs.appendFileSync('./query.json', s);
      s = '';
    }
  });
  fs.appendFileSync(file, s);
}

genP('./query.sql');
genM('./query.json');

