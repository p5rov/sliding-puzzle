var Game = (function () {
    var boardSize;

    var history = [];

    var getTile = function (x, y, i) {
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

    var setValue = function (tile, value) {
        var tileValueElement = $("span.tileSpan", tile);
        tileValueElement.attr("id", "value" + value);
        tileValueElement.attr('data-value', value);
        if (value !== 0) {
            tileValueElement.html(value);
        } else {
            tileValueElement.html("");
        }
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

    var getX = function (tile) {
        var x = $(tile).attr("data-slot-x");
        return Number(x);
    }

    var getY = function (tile) {
        var y = $(tile).attr("data-slot-y");
        return Number(y);
    }


    var swapTiles = function (tile1, tile2) {
        var tile1Child = $("span.tileSpan", tile1);
        var tile2Child = $("span.tileSpan", tile2);
        tile1Child.detach().appendTo('#' + $(tile2).attr('id'));
        tile2Child.detach().appendTo('#' + $(tile1).attr('id'));
    }

    var checkCompleted = function () {
        var completed = isCompleted();
        if (completed) {
            showCompleted();
        }
    };

    var showCompleted = function () {
        var board = $("#gameBoard");
        board.empty();
        var winner = $("#templates .winner").clone();
        board.append(winner);
    }

    var solve = function () {
        if (history.length > 0) {
            setTimeout(function () {
                historyBack();
                solve();
            },
                300);
        }
    };

    var addRandomElements = function() {
        var index = Math.floor((Math.random() * 16));
        var slots = $('[id^=slot]');
        var x = getX(slots[index]);
        var y = getY(slots[index]);
        var value = getValue(slots[index]);
        if (value === 0) {
            var tileValueElement = $("span.tileSpan", slots[index]);
            tileValueElement.attr('data-value', 2);
            tileValueElement.html(2);
        }
    }

    var moveLeft = function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                tile = $('#slot' + i + j);
                for (var k = j + 1; k < 4; k++) {
                    var value = getValue(tile);
                    var tile2 = $('#slot' + i + k);
                    var tile2Value = getValue(tile2);
                    if (tile2Value === value) {
                        setValue(tile, tile2Value + value);
                        setValue(tile2, 0);
                        break;
                    } else if (value === 0 && tile2Value !== 0) {
                        setValue(tile, tile2Value + value);
                        setValue(tile2, 0);
                    }
                }
            }
        }
    }

    var clickTile = function (event) {
        moveLeft();
        addRandomElements();
        addRandomElements();
        
    }

    var isFull = function () {
        var slots = $('[id^=slot]');
        var completed = true;
        for (var index = 0; index < slots.length; ++index) {
            var x = getX(slots[index]);
            var y = getY(slots[index]);
            var value = getValue(slots[index]);
            if (value === 0) {
                completed = false;
            }
        }

        return completed;
    }

    var init = function () {
        var size = 4;
        var board = $("#gameBoard");
        board.empty();
        for (var i = 0; i < size; i++) {
            var row = $("#tileTemplates .row").clone();
            board.append(row);
            for (var j = 0; j < size; j++) {
                var tile = $("#tileTemplates .tile").clone();
                var tileValueElement = $("span.tileSpan", tile);
                var value = 0;
                tileValueElement.attr('data-value', value);
                tile.attr("data-slot-x", i);
                tile.attr("id", "slot" + i + j);
                tile.attr("data-slot-y", j);

                row.append(tile);
            }
        }
    }

    return {
        init: init,
        clickTile: clickTile
    };
})();

var showMenu = function () {
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


window.onload = function () {
    Game.init();
};