# Filmify

Una experiencia de descubrimiento cinematográfico construida con React: catálogo de películas y series, búsqueda, fichas detalladas, trailers y un visualizador protegido por código de acceso.

## Qué incluye

- Catálogo de TMDB con filtros, carruseles, búsqueda y páginas de detalle.
- Diseño oscuro, limpio y adaptable a móvil, tablet y escritorio.
- Reproductor bloqueado hasta validar un código de invitación.
- Función serverless de Vercel; no hay Supabase, base de datos ni cuentas de usuario.

## Puesta en marcha

Requiere Node.js 20 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows puedes copiar `.env.example` a `.env` manualmente. Añade tu clave de TMDB en `VITE_TMDB_API_KEY`.

## Configurar el acceso en Vercel

1. Importa el repositorio en Vercel.
2. En **Settings → Environment Variables**, crea `FILMIFY_ACCESS_CODE` con el código que entregarás a las personas invitadas.
3. Configura también `VITE_TMDB_API_KEY` para producción.
4. Haz un nuevo despliegue.

La función `POST /api/verify-access` compara el código en el servidor y, si es válido, permite el visualizador durante siete días en ese navegador. El código nunca se incluye en el bundle público.

> El bloqueo protege la interfaz de Filmify. Puesto que el reproductor es un iframe de un proveedor externo, quien conozca y abra directamente la URL del proveedor no puede ser protegido por la aplicación. Para un control de acceso estricto al contenido habría que servir el vídeo desde un proveedor propio con URLs firmadas o un proxy autenticado.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el entorno local. |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Previsualiza el build. |
| `npm run lint` | Revisa errores y convenciones. |

## Estructura relevante

```text
api/verify-access.js     Validación serverless del código
src/components/Auth/     Estado local de acceso (sin proveedor externo)
src/pages/               Catálogo, detalle y pantalla de acceso
src/styles/              Estilos de la interfaz
```

## Tecnologías

React 19, Vite, React Router, TMDB, Swiper, GSAP y Vercel Functions.

## Licencia

[MIT](LICENSE)
