/**
 * Created by luis on 08/02/16.
 *
 * Juego de memoria
 */

(function(window, document, $, undefined){

    window.MemoryGame = function (where) {
        this.where = where;
        this.box = $(where);
    };

    MemoryGame.prototype.init = function (timeLimit, repeatedImgs, sourcesImgs) {
        this.timeLimit = timeLimit;
        this.repeatedImgs = repeatedImgs;
        this.sourcesImgs = sourcesImgs;
    };

    MemoryGame.prototype.run = function(){

        this.boxOpened = "";
        this.imgOpened = "";
        this.counter = 0;
        this.imgFound = 0;




        // crea las cajas con las imágenes de ImgSources
        // da dos vueltas por cada imagen.

        var source = this.where;
        for (var y = 1; y <= this.repeatedImgs ; y++) {
            $.each(this.sourcesImgs, function(i, val) {
                $(source).append("<div id=card" + y + i + "><img src=" + val + " />");
            });
        }

        // bindea la funcionalidad click  para cada caja con imágenes para que se
        // ejecute  la función OpenCard
        var base = this;
        $(source + " div").click(function(){
            openCard(base, this);
        });

        // mezcla todas las imágenes recién creadas.
        ShuffleImages(source);

    };


    // funciones extras

    /**
     * Devuelve un valor entre los pasados por parámetro
     *
     * @param {number} MinValue
     * @param {number} MaxValue
     * @returns {number}
     */
    function RandomFunction(MinValue, MaxValue) {
        return Math.round(Math.random() * (MinValue - MaxValue) + MaxValue);
    }

    /**
     * Agarra las imágenes de cada caja y las mezcla.
     */
    function ShuffleImages(Source) {
        var ImgAll = $(Source).children();
        var ImgThis = $(Source + " div:first-child");
        var ImgArr = new Array();

        // obtiene toda las imágenes
        for (var i = 0; i < ImgAll.length; i++) {
            ImgArr[i] = $("#" + ImgThis.attr("id") + " img").attr("src");
            ImgThis = ImgThis.next();
        }

        ImgThis = $(Source + " div:first-child");

        // re organiza las imágenes
        for (var z = 0; z < ImgAll.length; z++) {
            var RandomNumber = RandomFunction(0, ImgArr.length - 1);

            $("#" + ImgThis.attr("id") + " img").attr("src", ImgArr[RandomNumber]);
            ImgArr.splice(RandomNumber, 1);
            ImgThis = ImgThis.next();
        }
    }

    var openCard = function (game, element) {
        var source = game.where;
        var id = $(element).attr("id");

        // si está oculta la imagen
        if ($("#" + id + " img").is(":hidden")) {
            // quita la funcionalidad OpenCard a la caja actual
            $(source + " div").unbind("click", function(){
                openCard(game, this);
            });

            // muestra la imagen de la caja actual
            $("#" + id + " img").slideDown('fast');

            // si no había una caja abierta
            if (game.imgOpened == "") {
                // guarda el id de la caja actual
                game.boxOpened = id;
                // setea la ruta de la imagen actual como imagen abierta
                game.imgOpened = $("#" + id + " img").attr("src");

                setTimeout(function() {
                    $(source + " div").bind("click", function(){
                        openCard(game, this);
                    })
                }, 300);
            } else {
                // si había una caja abierta
                CurrentOpened = $("#" + id + " img").attr("src");

                // si la imagen de la caja actual es distinta a la última abierta
                if (game.imgOpened != CurrentOpened) {
                    // oculta las dos cajas y limpia la caja y la imagen abierta
                    setTimeout(function() {
                        $("#" + id + " img").slideUp('fast');
                        $("#" + game.boxOpened + " img").slideUp('fast');
                        game.boxOpened = "";
                        game.imgOpened = "";
                    }, 400);
                } else {
//				$("#" + id + " img").parent().css("visibility", "hidden");
//				$("#" + BoxOpened + " img").parent().css("visibility", "hidden");

                    // mantiene abierta la caja y incrementa la variable imágenes
                    // halladas
                    game.imgFound++;
                    game.boxOpened = "";
                    game.imgOpened = "";
                }
                setTimeout(function() {
                    $(source + " div").bind("click", function(){
                        openCard(game, this);
                    })
                }, 400);
            }

            // aumenta y actualiza la cantidad de clicks que se hizo
            game.counter++;
            $("#counter").html("" + game.counter);

            // si se hallaron todas las imágenes, agrega un mensaje.
            if (game.imgFound == game.sourcesImgs.length) {
                $("#counter").prepend('<span id="success">You Found All Pictues With </span>');
            }
        }
    };



})(window, document, jQuery);






