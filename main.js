// Configuración de la URL de Google Apps Script
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxy64aepvBrZDeT6V54HR0noDB8jky83EU-Dp2baKnMsDcouEIonZ2D_pfWeaWbWi11/exec";

$("#leadForm").on("submit", function (event) {
  event.preventDefault();

  const form = this;
  const $button = $(form).find('button[type="submit"]');
  const $status = $("#status");

  // Bloquear botón y mostrar estado de carga
  $button.prop("disabled", true).text("Enviando...");
  $status
    .removeClass("text-green-400 text-red-400")
    .addClass("text-gray-400")
    .text("Enviando solicitud...");

  // Recolectar datos del formulario usando jQuery de forma limpia
  const formData = {
    nombre: $('input[name="nombre"]').val(),
    apellido: $('input[name="apellido"]').val(),
    email: $('input[name="email"]').val(),
    telefono: $('input[name="telefono"]').val(),
    pais: $('input[name="pais"]').val(),
    referencia: $('input[name="referencia"]').val(),
    proyecto: $('textarea[name="proyecto"]').val(),
    presupuesto: $('input[name="presupuesto"]').val(),
    fecha: new Date().toLocaleString("es-ES"),
  };

  // Estructura de datos para FormSubmit (convertida a JSON String)
  const emailData = JSON.stringify({
    ...formData,
    _subject: "Nueva solicitud de cotización",
    _captcha: "false",
  });

  // Envío: Google Sheets
  $.ajax({
    url: GOOGLE_SCRIPT_URL,
    type: "POST",
    contentType: "text/plain;charset=utf-8",
    data: JSON.stringify(formData),
    crossDomain: true,
  }).always(function () {
    // Ejecutar el segundo envío sin importar si Sheets responde con éxito o error de CORS
    enviarFormSubmit(emailData, form, $status);
  });
});

// Envío: FormSubmit (Email)
function enviarFormSubmit(emailData, form, $status) {
  $.ajax({
    method: "POST",
    url: "https://formsubmit.co/ajax/bcolina88@gmail.com",
    contentType: "application/json",
    dataType: "json",
    data: emailData,
    success: function () {
      $status
        .removeClass("text-gray-400 text-red-400")
        .addClass("text-green-400")
        .text("Solicitud enviada correctamente.");
      form.reset();
    },
    error: function () {
      $status
        .removeClass("text-gray-400 text-green-400")
        .addClass("text-red-400")
        .text("No se pudo enviar la solicitud. Intenta nuevamente.");
    },
    complete: function () {
      // Desbloquear el botón al finalizar todo el proceso
      $(form)
        .find('button[type="submit"]')
        .prop("disabled", false)
        .text("Enviar Solicitud");
    },
  });
}
