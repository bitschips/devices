# Devices · Laboratorio electrónico

Aplicación web instalable (PWA) para inventariar lámparas solares, paneles, baterías y otros dispositivos electrónicos, y documentar sus pruebas.

**Versión:** 1.2.1 · **Fecha:** 20/11/2026

## Funcionalidades

- Ficha por dispositivo: nombre, categoría, marca/modelo, tienda, fecha de compra, precio en euros, dimensiones, peso, descripción y fotografía.
- Baterías: desplegables para química (Ni-Cd, Ni-MH, Li-ion, Li-Po, LiFePO4, litio primario, LTO, etc.) y formato físico (AAA, AA, Sub-C, CR2032, 10440, 14500, 16340, 18350, 18650, 20700, 21700, 26650, 32700, formatos pouch 103450/602030/503040, etc.). Incluye «Otro formato». Además, cantidad, capacidad en mAh y tensión nominal por batería.
- Potencia del equipo y características del panel solar.
- **Tabla de pruebas por dispositivo:** fecha y hora, tipo (autonomía, carga, medición, incidencia), valor numérico opcional, unidad y texto libre. Se pueden añadir, editar y eliminar filas; los datos se incluyen en XML.
- Búsqueda de fichas, tiendas y notas; resumen del número de dispositivos, gasto anotado y observaciones.
- Una foto comprimida a JPEG de hasta 800 px por dispositivo.
- Datos locales en **localStorage** del navegador, sin cuenta y sin servidor.
- Exportación XML (incluyendo fotos y notas), e importación por **fusión**: omite identificadores ya existentes.
- Interfaz adaptable a móviles, manifest PWA y recursos para funcionamiento sin conexión tras primera visita.

## Abrir e instalar

Si GitHub Pages está activado para la rama `main` y la carpeta raíz, abre:
https://bitschips.github.io/devices/

En Android, abre la dirección con Chrome y utiliza **Añadir a pantalla de inicio** o **Instalar aplicación**. Algunos navegadores pueden ofrecer un acceso directo en lugar de una instalación completa.

**Para publicar por primera vez:** GitHub → repositorio `devices` → **Settings → Pages** → **Deploy from a branch** → rama `main`, carpeta `/(root)`, guardar. La URL puede tardar en activarse.

## Copias y privacidad

Las fichas, observaciones y fotos **no se almacenan en GitHub**. Viven solo en el navegador y dispositivo donde se crean. Exporta XML después de registrar compras o pruebas y guarda la copia en otra ubicación; borrar datos del sitio, reinstalar el navegador o cambiar de móvil puede eliminarlos.

**Importación XML:** fusiona registros que aún no existan según su ID; no sustituye ni actualiza los que ya están. Guarda una copia antes de importar. Las fotos cuentan para el límite de almacenamiento del navegador.

## Estructura

- `index.html`: estructura, estilos y formularios responsive.
- `app.js`: fichas, notas, fotos, almacenamiento y copia XML.
- `manifest.webmanifest`: datos de instalación.
- `sw.js`: recursos sin conexión.
- `icon.svg`, `icon-maskable.svg`: iconos vectoriales normal y adaptativo.
- `icon-192.png`, `icon-512.png`: iconos PNG para la instalación.

## Ideas para siguientes versiones

- Registrar **varias baterías diferentes** en una misma ficha, con conexión en serie/paralelo.
- Tablas de mediciones con voltaje, corriente, potencia y duración real, y gráficas.
- Enlace a experimentos realizados en Battery Experiments.
- Exportar CSV, etiquetas, garantía/factura y búsqueda por fabricante.
- Una solución de sincronización opcional y cifrada entre dispositivos.

**Nota:** no es un cargador ni un controlador de seguridad eléctrica; es un cuaderno de registro.

© BitsChips · Uso personal.
## Nota sobre códigos de baterías

Los formatos cilíndricos de litio como 18650 (aprox. 18 × 65 mm) y 21700 (aprox. 21 × 70 mm) suelen codificar diámetros y longitudes nominales. Códigos de pouch como 103450 suelen referirse a grosor × ancho × largo (aprox. 10 × 34 × 50 mm), pero los fabricantes pueden variar las dimensiones. **El código físico no determina la química ni la tensión**, por lo que ambos campos se registran por separado.

## Cambios v1.1.0

- Tabla por dispositivo con pruebas y medidas, edición y borrado de filas.
- Desplegables amplios de química y formato de batería, incluyendo referencias cilíndricas y pouch de litio.
- Exportación e importación XML de valores numéricos y unidades.

## PWA v1.2.0 — instalación y uso sin conexión

- Manifest con nombre, identificador, URL inicial, ámbito, idioma, colores, modo standalone y dos iconos SVG: normal y adaptativo (*maskable*).
- Icono de electrónica (osciloscopio/mediciones y batería) visible en la cabecera.
- Service worker v1.2.0 con precaché de los recursos de la aplicación, limpieza de cachés antiguas, respuesta desde caché para recursos estáticos y estrategia red primero para navegación.
- La instalación requiere HTTPS y una URL publicada; GitHub Pages puede requerir activación por el propietario en Settings → Pages. La compatibilidad de instalación con iconos SVG depende del navegador: algunos dispositivos ahora también tienen iconos PNG de 192 y 512 píxeles incluidos en el manifiesto.
- Para actualizar después de instalarla, vuelve a abrir la aplicación con conexión; los datos continúan en el almacenamiento local de ese navegador.
