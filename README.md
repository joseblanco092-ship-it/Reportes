ELECTROMEDICINA CHET - Generador de reportes técnicos

Actualización basada en el proyecto original.
- Escáner multipágina con cámara, detección automática de bordes (OpenCV.js cuando está disponible), ajuste manual de esquinas y corrección de perspectiva.
- Generación local de PDF multipágina con nombre automático.
- Integración del PDF en el menú nativo de compartir junto con las fotografías.
- Menor duplicación de memoria en el flujo de fotografías y collage secuencial.
- Procesamiento de perspectiva por bloques para que Chrome Android pueda actualizar el indicador y responder durante el escaneo.
- Validación explícita de páginas e imágenes antes de construir el PDF; errores concretos y conservación de páginas para reintentar.

Publicación:
1. Descomprima el ZIP.
2. Suba el contenido de la carpeta Reportes-main a la raíz del repositorio GitHub Pages existente (manteniendo los nombres).
3. Confirme que GitHub Pages publique por HTTPS.
4. Abra la app en Chrome Android y recargue. El Service Worker fue actualizado a v10 para invalidar la caché anterior.

Notas:
- La cámara y Web Share requieren HTTPS y permisos del navegador.
- La detección automática utiliza OpenCV.js desde CDN; si no carga, el usuario puede ajustar las cuatro esquinas manualmente.
- El PDF se construye localmente en el navegador sin servicio externo.
- Android/WhatsApp deciden cómo presentar varios adjuntos. El navegador puede abrir una sola hoja de compartir con el texto, las fotos y el PDF; no puede garantizar dos mensajes separados ni el envío automático. Si el navegador no admite compartir archivos, el PDF se descarga como respaldo y se abre WhatsApp con el texto.
- Las pruebas de cámara, memoria real y WhatsApp requieren un teléfono Android; no se han simulado como pruebas físicas.

Auditoría y pruebas de esta entrega:
- El ZIP recibido ya tenía `openScanner()` declarada como `async`, el botón `scanFinish` con `type="button"` y el evento `click` registrado. La auditoría no encontró un error de sintaxis ni un ID duplicado que explique por sí solo un botón sin respuesta.
- Se comprobó en Chromium que `finishScan()` y `buildLocalPdf()` están disponibles. Se generaron y validaron PDFs de prueba de una y dos páginas.
- Se comprobó el flujo de captura aún no confirmada: al finalizar, la página se procesa y se incorpora al PDF.
- El procesamiento de perspectiva era síncrono y podía bloquear el hilo principal mientras recorría millones de píxeles. Se cambió a bloques con pausas de renderizado para evitar que Chrome parezca congelado y para que el indicador se vea.
- Se validan los datos antes de construir el PDF y se muestra el motivo del error. Las páginas se conservan si falla la generación y se puede reintentar.
- Se comprobó estáticamente que el PDF generado se mantiene en `scanPdfFile`, que es añadido a los archivos del flujo Web Share existente. La presentación final del menú y la recepción por WhatsApp dependen de Android y de la aplicación de destino.
- No se realizó una prueba física en un teléfono Android. La cámara, permisos, RAM real y el menú nativo de compartir deben verificarse en el dispositivo.
