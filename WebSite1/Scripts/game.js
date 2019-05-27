var Game = (function () {
    var emptyValue;
    var boardSize;
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
                tileValueElement.html(value);
                tileValueElement.attr('data-value', value);
                tile.attr("data-slot-x", i);
                tile.attr("data-slot-y", j);
                
                row.append(tile);
            }
        }
    }


    var getValue = function (tile) {
        var valueElement = $("span.tileSpan", tile);
        var value = valueElement.attr("data-value");
        return value;
    }

    var getX = function(tile) {
        return $(tile).attr("data-slot-x");
    }

    var getY = function(tile) {
        return $(tile).attr("data-slot-y");
    }

    var slapTiles = function (tile1, tile2) {
        var x = tile1.html;
        tile1.html = tile2.html;
        tile2.html = tile1.html;
    }

    var clickTile = function (event) {
        event = event || window.event;
        var tile = event.target;
        var value = getValue(tile);
        var x = getX(tile);
        var y = getY(tile);
        var emptyTile = $("#gameBoard").find("[data-value='" + emptyValue + "']").parent();
        var emptyTileX = getX(emptyTile);
        var emptyTileY = getY(emptyTile);
        if (x + 1 == emptyTileX && y == emptyTileY) {
            slapTiles(tile, emptyTile);
        }

        if (x - 1 == emptyTileX && y == emptyTileY) {
            slapTiles(tile, emptyTile);
        }

        if (x == emptyTileX && y + 1 == emptyTileY) {
            slapTiles(tile, emptyTile);
        }

        if (x == emptyTileX && y - 1 == emptyTileY) {
            slapTiles(tile, emptyTile);
        }
    }

    return {
        init: init,
        clickTile: clickTile
    };
})();