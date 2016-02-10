var BoxOpened = "";
var ImgOpened = "";
var Counter = 0;
var ImgFound = 0;

var Source = "#boxcard";

var ImgSource = [
  "http://img5.uploadhouse.com/fileuploads/17699/176992640c06707c66a5c0b08a2549c69745dc2c.png",
  "http://img6.uploadhouse.com/fileuploads/17699/17699263b01721074bf094aa3bc695aa19c8d573.png",
  "http://img6.uploadhouse.com/fileuploads/17699/17699262833250fa3063b708c41042005fda437d.png",
  "http://img9.uploadhouse.com/fileuploads/17699/176992615db99bb0fd652a2e6041388b2839a634.png",
  "http://img4.uploadhouse.com/fileuploads/17699/176992601ca0f28ba4a8f7b41f99ee026d7aaed8.png",
  "http://img3.uploadhouse.com/fileuploads/17699/17699259cb2d70c6882adc285ab8d519658b5dd7.png",
  "http://img2.uploadhouse.com/fileuploads/17699/1769925824ea93cbb77ba9e95c1a4cec7f89b80c.png",
  "http://img7.uploadhouse.com/fileuploads/17699/1769925708af4fb3c954b1d856da1f4d4dcd548a.png",
  "http://img9.uploadhouse.com/fileuploads/17699/176992568b759acd78f7cbe98b6e4a7baa90e717.png",
  "http://img9.uploadhouse.com/fileuploads/17699/176992554c2ca340cc2ea8c0606ecd320824756e.png"
];

/**
 * Devuelve un número de entre el mínimo y máximo valor ingresado
 *
 * @param MaxValue
 * @param MinValue
 * @returns {number}
 */
function RandomFunction(MaxValue, MinValue) {
	return Math.round(Math.random() * (MaxValue - MinValue) + MinValue);
}

/**
 * Agarra las imágenes de cada caja y las mezcla.
 */
function ShuffleImages() {
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

/**
 * Reinicia el juego
 *
 *  Re organiza las imágenes del tablero.
 *  Oculta todas las imágenes
 *  Vuelve el contador a 0
 *  Inicializa las variables de entorno.
 *
 * @returns {boolean}
 */
function ResetGame() {
	ShuffleImages();
	$(Source + " div img").hide();
	$(Source + " div").css("visibility", "visible");
	Counter = 0;
	$("#success").remove();
	$("#counter").html("" + Counter);
	BoxOpened = "";
	ImgOpened = "";
	ImgFound = 0;
	return false;
}

/**
 * Abre la imagen desde donde se ejecuta la función.
 */
function OpenCard() {
	var id = $(this).attr("id");

    // si está oculta la imagen
	if ($("#" + id + " img").is(":hidden")) {
        // quita la funcionalidad OpenCard a la caja actual
		$(Source + " div").unbind("click", OpenCard);

        // muestra la imagen de la caja actual
		$("#" + id + " img").slideDown('fast');

        // si no había una caja abierta
		if (ImgOpened == "") {
            // guarda el id de la caja actual
			BoxOpened = id;
            // setea la ruta de la imagen actual como imagen abierta
			ImgOpened = $("#" + id + " img").attr("src");

			setTimeout(function() {
				$(Source + " div").bind("click", OpenCard)
			}, 300);
		} else {
            // si había una caja abierta
			CurrentOpened = $("#" + id + " img").attr("src");

            // si la imagen de la caja actual es distinta a la última abierta
			if (ImgOpened != CurrentOpened) {
                // oculta las dos cajas y limpia la caja y la imagen abierta
				setTimeout(function() {
					$("#" + id + " img").slideUp('fast');
					$("#" + BoxOpened + " img").slideUp('fast');
					BoxOpened = "";
					ImgOpened = "";
				}, 400);
			} else {
//				$("#" + id + " img").parent().css("visibility", "hidden");
//				$("#" + BoxOpened + " img").parent().css("visibility", "hidden");

                // mantiene abierta la caja y incrementa la variable imágenes
                // halladas
				ImgFound++;
				BoxOpened = "";
				ImgOpened = "";
			}
			setTimeout(function() {
				$(Source + " div").bind("click", OpenCard)
			}, 400);
		}

        // aumenta y actualiza la cantidad de clicks que se hizo
		Counter++;
		$("#counter").html("" + Counter);

        // si se hallaron todas las imágenes, agrega un mensaje.
		if (ImgFound == ImgSource.length) {
			$("#counter").prepend('<span id="success">You Found All Pictues With </span>');
		}
	}
}

$(function() {
    // crea las cajas con las imágenes de ImgSources
    // da dos vueltas por cada imagen.
    for (var y = 1; y < 3 ; y++) {
        $.each(ImgSource, function(i, val) {
            $(Source).append("<div id=card" + y + i + "><img src=" + val + " />");
        });
    }

    // bindea la funcionalidad click  para cada caja con imágenes para que se
    // ejecute  la función OpenCard
	$(Source + " div").click(OpenCard);

    // mezcla todas las imágenes recién creadas.
	ShuffleImages();
});