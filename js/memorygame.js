/**
 * Created by luis on 08/02/16.
 *
 * Juego de memoria
 */

(function(window, document, $, undefined){

    window.MemoryGame = function (where) {
        this.where = where;
    };

    MemoryGame.prototype.init = function (repeatedImgs, sourcesImgs, time) {
        this.timeLimit = time[0];
        this.timeWhere = time[1];
        this.repeatedImgs = repeatedImgs;
        this.sourcesImgs = sourcesImgs;
    };

    MemoryGame.prototype.run = function(){
        this.boxOpened = "";
        this.imgOpened = "";
        this.counter = 0;
        this.imgFound = 0;
        this.timeExpered = false;
        this.timeDiff = this.timeLimit;

        // crea las cajas con las imágenes de ImgSources
        // da dos vueltas por cada imagen.
        createBoxes(this);

        // bindea la funcionalidad click  para cada caja con imágenes para que se
        // ejecute  la función OpenCard
        var base = this;

        $(this.where + " div").click(function(){
            openCard(base, this);
        });

        // mezcla todas las imágenes
        shuffleImages(this.where);

        // instancia el contador
        var display = document.querySelector(this.timeWhere);
        this.timer = startTimer(this, display);

        setInterval(function(){
            if (base.timeDiff <= 0) {
                clearInterval(base.timer);
                base.timeExpered = true;
            }
        }, 1000);

    };

    MemoryGame.prototype.reset = function(){
        shuffleImages(this.where);
        $(this.where + " div img").hide();
        $(this.where + " div").css("visibility", "visible");
        this.counter = 0;
        $("#success").remove();
        $("#counter").html("" + this.counter);
        this.boxOpened = "";
        this.imgOpened = "";
        this.imgFound = 0;
        this.timeExpered = false;

        clearInterval(this.timer);
        var display = document.querySelector(this.timeWhere);
        this.timer = startTimer(this, display);

        return false;
    };


    // funciones extras

    /**
     * Devuelve un valor entre los pasados por parámetro
     *
     * @param {number} MinValue
     * @param {number} MaxValue
     * @returns {number}
     */
    var randomFunction = function(MinValue, MaxValue) {
        return Math.round(Math.random() * (MinValue - MaxValue) + MaxValue);
    };

    /**
     * Agarra las imágenes de cada caja y las mezcla.
     */
    var shuffleImages = function(source) {
        var ImgAll = $(source).children();
        var ImgThis = $(source + " div:first-child");
        var ImgArr = new Array();

        // obtiene toda las imágenes
        for (var i = 0; i < ImgAll.length; i++) {
            ImgArr[i] = $("#" + ImgThis.attr("id") + " img").attr("src");
            ImgThis = ImgThis.next();
        }

        ImgThis = $(source + " div:first-child");

        // re organiza las imágenes
        for (var z = 0; z < ImgAll.length; z++) {
            var RandomNumber = randomFunction(0, ImgArr.length - 1);

            $("#" + ImgThis.attr("id") + " img").attr("src", ImgArr[RandomNumber]);
            ImgArr.splice(RandomNumber, 1);
            ImgThis = ImgThis.next();
        }
    }

    /**
     * Abre la tarjeta pasada por parámetro.
     *
     * @param game
     * @param element
     */
    var openCard = function (game, element) {
        //si el tiempo terminó sale
        if (game.timeExpered) {
            return false;
        }

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

    /**
     * Crea las cajas a partir de las imágenes pasadas.
     *
     * @param game
     */
    var createBoxes = function(game){
        for (var y = 1; y <= game.repeatedImgs ; y++) {
            $.each(game.sourcesImgs, function(i, val) {
                $(game.where).append(
                    "<div id=card" + y + i + "><img src=" + val + " />"
                );
            });
        }
    }

    var startTimer = function(game, display) {
        var start = Date.now(),
            diff,
            minutes,
            seconds;

        function timer() {
            // get the number of seconds that have elapsed since
            // startTimer() was called
            diff = game.timeLimit - (((Date.now() - start) / 1000) | 0);

            // does the same job as parseInt truncates the float
            minutes = (diff / 60) | 0;
            seconds = (diff % 60) | 0;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

        };
        // we don't want to wait a full second before the timer starts
        timer();

        return setInterval(function(){
            timer();
            game.timeDiff = diff;
        }, 1000);
    }

})(window, document, jQuery);






