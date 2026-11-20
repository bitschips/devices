# Devices · Laboratorio electrónico

Aplicación web instalable (PWA) para inventariar lámparas solares, paneles, baterías y otros dispositivos electrónicos, y documentar sus pruebas.

**Versión:** 1.0.0 · **Fecha:** 20/11/2026

## Funcionalidades

- Ficha por dispositivo: nombre, categoría, marca/modelo, tienda, fecha de compra, precio en euros, dimensiones, peso, descripción y fotografía.
- Baterías: química (Ni-Cd, Ni-MH, Li-ion, Li-Po, LiFePO4, plomo-ácido, alcalina u otra), cantidad, formato (AA, 18650, etc.), capacidad en mAh y tensión nominal por batería.
- Potencia del equipo y características del panel solar.
- **Diario cronológico** de observaciones ilimitadas por dispositivo: autonomía, carga, medición, incidencia u otra. Cada entrada conserva fecha y texto; se puede eliminar.
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
- `icon.svg`: icono vectorial.

## Ideas para siguientes versiones

- Registrar **varias baterías diferentes** en una misma ficha, con conexión en serie/paralelo.
- Tablas de mediciones con voltaje, corriente, potencia y duración real, y gráficas.
- Enlace a experimentos realizados en Battery Experiments.
- Exportar CSV, etiquetas, garantía/factura y búsqueda por fabricante.
- Una solución de sincronización opcional y cifrada entre dispositivos.

**Nota:** no es un cargador ni un controlador de seguridad eléctrica; es un cuaderno de registro.

© BitsChips · Uso personal.