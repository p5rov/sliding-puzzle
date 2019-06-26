var Game = (function () {
    var start;
    var stop;
    var started = false;
    var startTimer = function() {
        if (started) {
            return;
        }

        started = true;
        stop = false;
        start = Date.now();
        var f = function() {
            var diff = Date.now() - start, ns = (((diff) / 1000) >> 0), m = (ns / 60) >> 0, s = ns - m * 60;
            var text = "" + m + ':' + (('' + s).length > 1 ? '' : '0') + s;
            $('#time').html(text);
            if (stop) {
                return;
            }
            setTimeout(f, 1000);
        };

        f();
    };
    
    var updateScores = function (sum) {
        var el = $('#scores')
        var currentValue = Number(el.html());
        el.html(sum + currentValue);
    }


    var setValue = function (tile, value) {
        var tileV = $(tile);

        var tileValueElement = $("span.tileSpan", tile);
        tileValueElement.attr("id", "value" + value);
        tileV.attr('data-value', value);
        
        if (value !== 0) {
            tileValueElement.html(value);
        } else {
            tileValueElement.html("");
        }
    }
    
    var getValue = function (tile) {
        var value = $(tile).attr("data-value");
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
    
    var showCompleted = function () {
        stop = true;
        var board = $("#gameBoard");
        board.empty();
        var winner = $("#templates .winner").clone();
        board.append(winner);
    }
    
    var addRandomElements = function () {
        while (!isFull()) {
            var index = Math.floor((Math.random() * 16));
            var slots = $('[id^=slot]');
            var x = getX(slots[index]);
            var y = getY(slots[index]);
            var value = getValue(slots[index]);
            if (value === 0 || value === 2) {
                setValue(slots[index], value + 2);
                break;
            }
        }
    }

    var moveLeft = function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = j + 1; k < 4; k++) {
                    tile = $('#slot' + i + j);
                    var value = getValue(tile);
                    var tile2 = $('#slot' + i + k);
                    var tile2Value = getValue(tile2);
                    if (tile2Value === value && value !== 0) {
                        setValue(tile, tile2Value + value);
                        setValue(tile2, 0);
                        updateScores(tile2Value + value);
                        break;
                    } else if (value === 0 && tile2Value !== 0) {
                        setValue(tile, tile2Value + value);
                        setValue(tile2, 0);
                    }
                }
            }
        }
        onAfterMove();
    }

    var moveRight = function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j >= 0; j--) {
                for (var k = j - 1; k >= 0; k--) {
                    tile = $('#slot' + i + j);
                    var value = getValue(tile);
                    var tile2 = $('#slot' + i + k);
                    var tile2Value = getValue(tile2);
                    if (tile2Value === value && value !== 0) {
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
        onAfterMove();
    }
    
    var moveUp = function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = j + 1; k < 4; k++) {
                    tile = $('#slot' + j + i);
                    var value = getValue(tile);
                    var tile2 = $('#slot' + k + i);
                    var tile2Value = getValue(tile2);
                    if (tile2Value === value && value !== 0) {
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

        onAfterMove();
    }

    var moveDown = function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 3; j >= 0; j--) {
                tile = $('#slot' + j + i);
                for (var k = j - 1; k >= 0; k--) {
                    var value = getValue(tile);
                    var tile2 = $('#slot' + k + i);
                    var tile2Value = getValue(tile2);
                    if (tile2Value === value && value !== 0) {
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

        onAfterMove();
    }
    
    var canMove = function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var tile = $('#slot' + i + j);
                var tile2 = $('#slot' + (i + 1) + j);
                var tile3 = $('#slot' + i + (j + 1));
                var value = getValue(tile);
                var value2 = getValue(tile2);
                var value3 = getValue(tile3);
                if (value === 0 || value === value2 || value === value3) {
                    return true;
                }
            }
        }

        return false;
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
                tile.attr('data-value', value);
                tile.attr("data-slot-x", i);
                tile.attr("id", "slot" + i + j);
                tile.attr("data-slot-y", j);
                row.append(tile);
            }
        }
    }

    var checkKey = function (e) {
        e = e || window.event;

        if (e.keyCode == '38') {
            moveUp();
        }
        else if (e.keyCode == '40') {
            moveDown();
        }
        else if (e.keyCode == '37') {
            moveLeft();
        }
        else if (e.keyCode == '39') {
            moveRight();
        }
    }

    var onAfterMove = function () {
        addRandomElements();
        addRandomElements();
        startTimer();
        if (isFull() && !canMove()) {
            showCompleted();
        }
    }

    return {
        init: init,
        checkKey: checkKey,
        moveLeft: moveLeft,
        moveRight: moveRight,
        moveUp: moveUp,
        moveDown: moveDown
    };
})();

window.onload = function () {
    Game.init();
    document.onkeydown = Game.checkKey;

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
        var firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                Game.moveLeft();
            } else {
                Game.moveRight();
            }
        } else {
            if (yDiff > 0) {
                Game.moveUp();
            } else {
                Game.moveDown();
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };

};