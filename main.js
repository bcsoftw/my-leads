// Configuración, aca puedes reemplazar con tu URL de Google Apps Scrip
const GOOGLE_SCRIPT_URL =  'https://script.google.com/macros/s/AKfycbxy64aepvBrZDeT6V54HR0noDB8jky83EU-Dp2baKnMsDcouEIonZ2D_pfWeaWbWi11/exec';

// Seleccionar elementos del DOM
const form = document.getElementById('leadForm');
const statusElement = document.getElementById('status');

// Inputs del formulario
const nombreInput = document.querySelector('input[name="nombre"]');
const apellidoInput = document.querySelector('input[name="apellido"]');
const emailInput = document.querySelector('input[name="email"]');
const telefonoInput = document.querySelector('input[name="telefono"]');
const paisInput = document.querySelector('input[name="pais"]');
const referenciaInput = document.querySelector('input[name="referencia"]');
const proyectoInput = document.querySelector('textarea[name="proyecto"]');
const presupuestoInput = document.querySelector('input[name="presupuesto"]');

// Manejar el envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Deshabilitar el botón de envío
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';

  // Mostrar mensaje de carga
  statusElement.textContent = 'Enviando información...';
  statusElement.className = 'text-center text-sm mt-4 text-blue-400';

  try {
    // Preparar datos del formulario
    const data = {
      nombre: nombreInput.value,
      apellido: apellidoInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      pais: paisInput.value,
      referencia: referenciaInput.value,
      proyecto: proyectoInput.value,
      presupuesto: presupuestoInput.value,
      fecha: new Date().toLocaleString('es-ES')
    };

    // Enviar datos a Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // Enviar notificación de WhatsApp (si está habilitado)
    if (typeof enviarNotificacionWhatsApp === 'function') {
      await enviarNotificacionWhatsApp(data);
    }

    // Nota: Con 'no-cors' no podemos leer la respuesta, pero el envío funciona
    // Mostrar mensaje de éxito
    statusElement.textContent = '¡Solicitud enviada correctamente! Nos pondremos en contacto pronto.';
    statusElement.className = 'text-center text-sm mt-4 text-green-400';

    // Limpiar formulario
    form.reset();

  } catch (error) {
    console.error('Error:', error);
    statusElement.textContent = 'Error al enviar la solicitud. Por favor, intenta nuevamente.';
    statusElement.className = 'text-center text-sm mt-4 text-red-400';
  } finally {
    // Rehabilitar el botón
    submitButton.disabled = false;
    submitButton.textContent = originalText;

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      statusElement.textContent = '';
    }, 5000);
  }
});
