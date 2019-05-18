var Game = (function () {
    var tiles = [];
    var init = function (size) {
        var board = $("#gameBoard");
        for (var i = 0; i < size; i++) {
			var row = $("#tileTemplates .row").clone();
			board.append(row);
            for (var j = 0; j < size; j++) {
                var tile = $("#tileTemplates .tile").clone();
                $("span.tileSpan", tile).html(i * size + j + 1);
                row.append(tile);
            }
        }
    }

    return {
        init: init
    };
})();