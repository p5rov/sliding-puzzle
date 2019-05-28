var Game = (function () {
    var emptyValue;
    var boardSize;

    var history = [];

    var getTile = function (x, y, i){
        var tile;
        if (i === 0 && (x + 1) < boardSize) {
            tile = $('#slot' + (x + 1) + y);
        } else if (i === 2 && (x - 1) >= 0) {
            tile = $('#slot' + (x - 1) + y);
        } else if (i === 1 && (y + 1) < boardSize) {
            tile = $('#slot' + x + (y + 1));
        } else if (i === 3 && (y - 1) >= 0) {
            tile = $('#slot' + x + (y - 1));
        }
        else {
            tile = undefined;
        }

        return tile;
    }

    var historyBack = function () {
        var emptyTile = getEmptyTile();
        var emptyX = getX(emptyTile);
        var emptyY = getY(emptyTile);
        var i = history.pop();
        var j = (i + 2) % 4;
        var tileToMove = getTile(emptyX, emptyY, j);
        swapTiles(emptyTile, tileToMove);
    }

    var getEmptyTile = function () {
        return $('#value' + emptyValue).parent();
    }

    var shuffle = function (dept) {
        if (dept <= 0) {
            return;
        }

        var emptyTile = getEmptyTile();
        var randomNumber = Math.floor(Math.random() * 4);
        var emptyX = getX(emptyTile);
        var emptyY = getY(emptyTile);
        var tile = getTile(emptyX, emptyY, randomNumber);
        if (tile) {
            swapTiles(tile, emptyTile);
            history.push(randomNumber);
            setTimeout(function () {
                var dp = dept - 1;
                    shuffle(dp);
                },
                300);
        }
        else {
            shuffle(dept);
        }
    } 

    var getValue = function (tile) {
        var valueElement = $("span.tileSpan", tile);
        var value = valueElement.attr("data-value");
        return Number(value);
    }

    var getX = function(tile) {
        var x = $(tile).attr("data-slot-x");
        return Number(x);
    }

    var getY = function(tile) {
        var y = $(tile).attr("data-slot-y");
        return Number(y);
    }


    var swapTiles = function (tile1, tile2) {
        var tile1Child = $("span.tileSpan", tile1);
        var tile2Child = $("span.tileSpan", tile2);
        tile1Child.detach().appendTo('#' + $(tile2).attr('id'));
        tile2Child.detach().appendTo('#' + $(tile1).attr('id'));
    }

    var clickTile = function (event) {
        event = event || window.event;
        var tile = event;
        var x = getX(tile);
        var y = getY(tile);
        var emptyTile = $("#gameBoard").find("[data-value='" + emptyValue + "']").parent();
        var emptyTileX = getX(emptyTile);
        var emptyTileY = getY(emptyTile);
        if (x + 1 === emptyTileX && y === emptyTileY) {
            swapTiles(tile, emptyTile);
            history.push(2);
        }

        if (x - 1 === emptyTileX && y === emptyTileY) {
            swapTiles(tile, emptyTile);
            history.push(0);
        }

        if (x === emptyTileX && y + 1 === emptyTileY) {
            swapTiles(tile, emptyTile);
            history.push(3);
        }

        if (x === emptyTileX && y - 1 === emptyTileY) {
            swapTiles(tile, emptyTile);
            history.push(1);
        }
    }

    var init = function (size) {
        emptyValue = size * size;
        boardSize = size;
        var board = $("#gameBoard");
        board.empty();
        for (var i = 0; i < size; i++) {
            var row = $("#tileTemplates .row").clone();
            board.append(row);
            for (var j = 0; j < size; j++) {
                var tile = $("#tileTemplates .tile").clone();
                var tileValueElement = $("span.tileSpan", tile);
                var value = i * size + j + 1;
                tileValueElement.attr("id", "value" + value);
                if (value !== emptyValue) {
                    tileValueElement.html(value);
                } else {
                    tileValueElement.html("");
                    tileValueElement.addClass("emptyTile");
                }
     
                tileValueElement.attr('data-value', value);
                tile.attr("data-slot-x", i);
                tile.attr("id", "slot" + i + j);
                tile.attr("data-slot-y", j);

                row.append(tile);
            }
        }

        shuffle(30);
    }

    return {
        init: init,
        clickTile: clickTile,
        back: historyBack,
    };
})();

var showMenu = function() {
    $("#menu").removeClass("hidden");
    $("#menuButtons").removeClass("hidden");
};

var hideMenu = function () {
    $("#menu").addClass("hidden");
    $("#menuButtons").addClass("hidden");
};

var showGame = function () {
    $("#gameBoard").removeClass("hidden");
    $("#gameButtons").removeClass("hidden");
};

var hideGame = function () {
    $("#gameBoard").addClass("hidden");
    $("#gameButtons").addClass("hidden");
};


window.onload = function() {
    document.getElementById("menuButton").addEventListener("click",
        function () {
            hideGame();
            showMenu();
        });
    document.getElementById("startButton").addEventListener("click",
        function() {
            hideMenu();
            showGame();
            var size = $("#size").val();
            Game.init(size);
        });

};