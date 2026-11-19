ELECTROMEDICINA CHET - Generador de reportes técnicos

Actualización basada en el proyecto original.
- Escáner multipágina con cámara, detección automática de bordes (OpenCV.js cuando está disponible), ajuste manual de esquinas y corrección de perspectiva.
- Generación local de PDF multipágina con nombre automático.
- Integración del PDF en el menú nativo de compartir junto con las fotografías.
- Menor duplicación de memoria en el flujo de fotografías y collage secuencial.

Publicación:
1. Descomprima el ZIP.
2. Suba el contenido de la carpeta Reportes-main a la raíz del repositorio GitHub Pages existente (manteniendo los nombres).
3. Confirme que GitHub Pages publique por HTTPS.
4. Abra la app en Chrome Android y recargue. El Service Worker fue actualizado a v9.

Notas:
- La cámara y Web Share requieren HTTPS y permisos del navegador.
- La detección automática utiliza OpenCV.js desde CDN; si no carga, el usuario puede ajustar las cuatro esquinas manualmente.
- El PDF se construye localmente en el navegador sin servicio externo.
- Android/WhatsApp deciden cómo presentar varios adjuntos. El navegador puede abrir una sola hoja de compartir con el texto, las fotos y el PDF; no puede garantizar dos mensajes separados ni el envío automático. Si el navegador no admite compartir archivos, el PDF se descarga como respaldo y se abre WhatsApp con el texto.
- Las pruebas de cámara, memoria real y WhatsApp requieren un teléfono Android; no se han simulado como pruebas físicas.
