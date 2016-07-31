// app.js

var globals = {
  canvas: undefined,
  ctx: undefined,
  tileImg: undefined,
  tileSize: 32,
  tiles: [],
  map: [],
  toggleTiles: true,
  gridX: undefined,
  gridY: undefined,
};

function clearBackground(ctx) {
  // Clear the background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
}

function draw() {
  var ctx = globals.ctx;
  if (ctx) {    
    clearBackground(ctx);
    drawMapTiles(ctx);
    drawMouseCursor(ctx);
  }
}

function drawMouseCursor(ctx) {
  if (globals.gridX && globals.gridY) {
    var gridX = ~~globals.gridX;
    var gridY = ~~globals.gridY;

    if (globals.map.length > 0 && globals.map[gridY][gridX] === 1) {
      var sx = gridX * globals.tileSize;
      var sy = gridY * globals.tileSize;
      var ex = (gridX + 1) * globals.tileSize - 1;
      var ey = (gridY + 1) * globals.tileSize - 1;
      var dashLength = globals.tileSize / 4;
      
      ctx.strokeStyle = 'lightgreen';
      ctx.lineWidth = 2;
    
      ctx.beginPath();

      // lower left
      ctx.moveTo(sx, ey - dashLength);
      ctx.lineTo(sx, ey);
      ctx.lineTo(sx + dashLength, ey);

      // upper left
      ctx.moveTo(sx, sy + dashLength);
      ctx.lineTo(sx, sy);
      ctx.lineTo(sx + dashLength, sy);

      // lower right
      ctx.moveTo(ex - dashLength, ey);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex, ey - dashLength);

      // upper right
      ctx.moveTo(ex - dashLength, sy);
      ctx.lineTo(ex, sy);
      ctx.lineTo(ex, sy + dashLength);

      ctx.stroke();
    }
  }
}

function drawMapTiles(ctx) {
  if (globals.tiles && globals.tiles.length > 0 && globals.tiles[0].length > 0) {
    var waterTile = globals.waterTile;
    var landTile = globals.landTile;

    var waterEdge = {
      Bottom: globals.tiles[5][2],
      Left: globals.tiles[5][3],
      Top: globals.tiles[5][0],
      Right: globals.tiles[5][1],
    };

    var waterOutset = {
      TopLeft: globals.tiles[4][7],
      TopRight: globals.tiles[4][4],
      BottomRight: globals.tiles[4][5],
      BottomLeft: globals.tiles[4][6],
    };

    var waterInset = {
      TopLeft: globals.tiles[5][5],
      TopRight: globals.tiles[5][6],
      BottomRight: globals.tiles[5][7],
      BottomLeft: globals.tiles[5][4],
    };

    for (var y = 0; y < globals.mapHeight; y++) {
      for (var x = 0; x < globals.mapWidth; x++) {
        var tile = globals.map[y][x] === 1 ? landTile : waterTile;
        var tileAbove = y == 0 ? waterTile :
                        (globals.map[y - 1][x] === 1 ? landTile : waterTile);
        var tileBelow = y == (globals.mapHeight - 1) ? waterTile :
                        (globals.map[y + 1][x] === 1 ? landTile : waterTile);
        var tileRight = x == (globals.mapWidth - 1) ? waterTile :
                        (globals.map[y][x + 1] === 1 ? landTile : waterTile);
        var tileLeft = x == 0 ? waterTile :
                       (globals.map[y][x - 1] === 1 ? landTile : waterTile);
        var tileLowerRight = (x == (globals.mapWidth - 1) || y == (globals.mapHeight - 1)) ? waterTile :
                             (globals.map[y + 1][x + 1] === 1 ? landTile : waterTile);
        var tileLowerLeft = (x == 0 || y == (globals.mapHeight - 1)) ? waterTile :
                            (globals.map[y + 1][x - 1] === 1 ? landTile : waterTile);
        var tileUpperLeft = (x == 0 || y == 0) ? waterTile :
                            (globals.map[y - 1][x - 1] === 1 ? landTile : waterTile);
        var tileUpperRight = (x == (globals.mapWidth - 1) || y == 0) ? waterTile :
                            (globals.map[y - 1][x + 1] === 1 ? landTile : waterTile);
        
        if (globals.toggleTiles) {
          /*********************************************/

          // WATER LEFT
          // if (the current tile is water) AND (tile to the right is land) AND
          //    (tile above is water) AND (tile below is water)
          if (tile === waterTile &&
              tileRight === landTile &&
              tileAbove === waterTile &&
              tileBelow === waterTile) {
            tile = waterEdge.Left;
          }

          // WATER RIGHT
          // if (the current tile is water) AND (tile to the left is land) AND
          //    (tile above is water) AND (tile below is water)
          if (tile === waterTile &&
              tileLeft === landTile &&
              tileAbove === waterTile &&
              tileBelow === waterTile) {
            tile = waterEdge.Right;
          }

          // WATER TOP
          // if (the current tile is water) AND (tile to the left is water) AND
          //    (tile right is water) AND (tile below is land)
          if (tile === waterTile &&
              tileBelow === landTile &&
              tileRight === waterTile &&
              tileLeft === waterTile) {
            tile = waterEdge.Top;
          }

          // WATER BOTTOM
          // if (the current tile is water) AND (tile to the left is water) AND
          //    (tile right is water) AND (tile above is land)
          if (tile === waterTile &&
              tileAbove === landTile &&
              tileRight === waterTile &&
              tileLeft === waterTile) {
            tile = waterEdge.Bottom;
          }

          /*********************************************/

          // LAND TOP LEFT
          // if (the current tile is water) AND (tile to the lowerright is land) AND
          //    (tile right is water) AND (tile below is water)
          if (tile === waterTile &&
              tileLowerRight === landTile &&
              tileRight === waterTile &&
              tileBelow === waterTile) {
            tile = waterOutset.TopLeft;
          }

          // LAND TOP RIGHT
          // if (the current tile is water) AND (tile to the lowerleft is land) AND
          //    (tile left is water) AND (tile below is water)
          if (tile === waterTile &&
              tileLowerLeft === landTile &&
              tileLeft === waterTile &&
              tileBelow === waterTile) {
            tile = waterOutset.TopRight;
          }

          // LAND BOTTOM RIGHT
          // if (the current tile is water) AND (tile to the upperleft is land) AND
          //    (tile left is water) AND (tile above is water)
          if (tile === waterTile &&
              tileUpperLeft === landTile &&
              tileLeft === waterTile &&
              tileAbove === waterTile) {
            tile = waterOutset.BottomRight;
          }

          // LAND BOTTOM LEFT
          // if (the current tile is water) AND (tile to the upperright is land) AND
          //    (tile right is water) AND (tile above is water)
          if (tile === waterTile &&
              tileUpperRight === landTile &&
              tileRight === waterTile &&
              tileAbove === waterTile) {
            tile = waterOutset.BottomLeft;
          }

          /*********************************************/

          // WATER INSET - Bottom Left
          /*
              _ W _
              L W W
              _ L _
          */
          // if (the current tile is water) AND (tile above is water) AND ( tile right is water) AND
          //    (tile left is land) AND (tile below is land)
          if (tile === waterTile &&
              tileRight === waterTile &&
              tileAbove === waterTile &&
              tileLeft === landTile &&
              tileBelow === landTile) {
            tile = waterInset.BottomLeft;
          }

          // WATER INSET - Bottom Right
          /*
              _ W _
              W W L
              _ L _
          */
          // if (the current tile is water) AND (tile above is water) AND ( tile left is water) AND
          //    (tile right is land) AND (tile below is land) 
          if (tile === waterTile &&
              tileLeft === waterTile &&
              tileAbove === waterTile &&
              tileRight === landTile &&
              tileBelow === landTile) {
            tile = waterInset.BottomRight;
          }

          // WATER INSET - Top Right
          /*
              _ L _
              W W L
              _ W _
          */
          // if (the current tile is water) AND (tile below is water) AND ( tile left is water) AND
          //    (tile right is land) AND (tile above is land)
          if (tile === waterTile &&
              tileLeft === waterTile &&
              tileBelow === waterTile &&
              tileRight === landTile &&
              tileAbove === landTile) {
            tile = waterInset.TopRight;
          }

          // WATER INSET - Top Left
          /*
              _ L _
              L W W
              _ W _
          */
          // if (the current tile is water) AND (tile below is water) AND ( tile right is water) AND
          //    (tile Left is land) AND (tile above is land)
          if (tile === waterTile &&
              tileRight === waterTile &&
              tileBelow === waterTile &&
              tileLeft === landTile &&
              tileAbove === landTile) {
            tile = waterInset.TopLeft;
          }
        }

        ctx.putImageData(tile, x * 32, y * 32);
      }
    }

    for (var y = 0; y < globals.mapHeight; y++)
      ctx.putImageData(waterTile, globals.mapWidth * 32, y * 32);
    for (var x = 0; x <= globals.mapWidth; x++)
      ctx.putImageData(waterTile, x * 32, globals.mapHeight * 32);

  }
}

function init() {
  // set canvas to fill the screen
  globals.canvas = document.getElementById('canvas');
  globals.canvas.width = window.innerWidth;
  globals.canvas.height = window.innerHeight;
  globals.ctx = globals.canvas.getContext('2d');

  window.addEventListener('resize', function() {
    globals.canvas.width = window.innerWidth;
    globals.canvas.height = window.innerHeight;
  });

  window.addEventListener('click', function() {
    globals.toggleTiles = !globals.toggleTiles;
  });

  window.addEventListener('mousemove', function(e) {
    var mouseX = e.clientX
    var mouseY = e.clientY;
    globals.gridX = mouseX / globals.tileSize;
    globals.gridY = mouseY / globals.tileSize;
  });

  window.addEventListener('mouseout', function() {
    globals.gridX = globals.gridY = undefined;
  });

  window.addEventListener('keyup', function(e) {
  });

  globals.map = generateMap();
  globals.mapHeight = globals.map.length;
  globals.mapWidth = globals.map[0].length;

  // load tiles
  // Tiles taken from http://opengameart.org/content/top-down-grass-beach-and-water-tileset
  image('./tileset_32x32.png')
    .then(function(img) {
      globals.tileImg = img;
      globals.tiles = processTiles(img);
      globals.waterTile = globals.tiles[0][0];
      globals.landTile = globals.tiles[4][0];
      return img;
    })
    .catch(console.error);
}

function generateMap() {
  var maxXTiles = ~~(globals.canvas.width / globals.tileSize);
  var maxYTiles = ~~(globals.canvas.height / globals.tileSize);

  // Using half of the max tiles in each direction, a minimap will be
  // created randomly, then scaled up to the full size. This allows the
  // map to be in chunks of 2x2, which works well for the tiles

  var halfMaxX = ~~(maxXTiles / 2);
  var halfMaxY = ~~(maxYTiles / 2);
  var minimap = [];
  for (var y = 0; y < halfMaxY; y++) {
    var row = [];
    for (var x = 0; x < halfMaxX; x++) {
      row[x] = (Math.random() < 0.4 ? 1 : 0);
    }
    minimap.push(row);
  }

  // remove "small lakes" (water tile surrounded by land)
  globals.beforeLakes = minimap.map(arr => arr.slice());
  for (var y = 1; y < halfMaxY-1; y++) {
    for (var x = 1; x < halfMaxX-1; x++) {
      var isLandAbove = (minimap[y-1][x] === 1);
      var isLandBelow = (minimap[y+1][x] === 1);
      var isLandRight = (minimap[y][x+1] === 1);
      var isLandLeft = (minimap[y][x-1] === 1);
      var isCurrWater = (minimap[y][x] === 0);
      if (isLandLeft && isLandRight && isLandBelow && isLandAbove && isCurrWater) {
        minimap[y][x] = 1;
      }
    }
  }

  // Scale the map up
  var map = [];
  for (var y = 0; y < halfMaxY; y++) {
    var row = [0];
    for (var x = 0; x < halfMaxX; x++) {
      row[x * 2] = row[(x * 2) + 1] = minimap[y][x];
    }
    map.push(row);
    map.push(row);
  }

  return map;
}

function processTiles(img) {
  // Create an offscreen canvas with the whole tile image
  var tileCanvas = document.createElement('canvas');
  tileCanvas.width = img.width;
  tileCanvas.height = img.height;
  var ctx = tileCanvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, img.width, img.height);
  ctx.drawImage(img, 0, 0);

  var tiles = [];
  var numXTiles = img.width / globals.tileSize;
  var numYTiles = img.height / globals.tileSize;
  for (var y = 0; y < numYTiles; y++) {
    var row = [];
    for (var x = 0; x < numXTiles; x++) {
      row.push(ctx.getImageData(x * globals.tileSize, y * globals.tileSize,
        globals.tileSize, globals.tileSize));
    }
    tiles.push(row);
  }

  return tiles;
}

function image(path) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.addEventListener('load', function(){ resolve(img) }, false);
    img.addEventListener('error', reject, false);
    img.src = path;
  });
}

window.onload = function() {
  init();
  setInterval(draw, 50);
};
