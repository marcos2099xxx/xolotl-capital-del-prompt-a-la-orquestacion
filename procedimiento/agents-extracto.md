# Contrato Operativo y Memoria Externa: `AGENTS.md`

> **Conceptualización metodológica:** En este proyecto, el archivo `AGENTS.md` **no representa una memoria cognitiva biológica ni un estado neural interno del modelo de lenguaje**, dado que las interacciones con modelos de lenguaje carecen de estado (*stateless*). En su lugar, actúa como una **memoria externa persistente y un contrato operativo explícito** inyectado en el contexto de cada sesión de desarrollo. Su función es reducir la pérdida de contexto entre sesiones independientes, delimitar fronteras de seguridad y codificar el aprendizaje institucional acumulado a lo largo de más de 1,200 commits.

---

## 1. Ficha del Documento Canónico

- **Archivo original:** `AGENTS.md` (361 líneas en la raíz del repositorio privado de Xolotl Capital).
- **Snapshot representativo:** Estado consolidado al 26 de septiembre de 2026.
- **Criterio de saneamiento:** Se reproduce la estructura completa de sus 13 secciones operativas, saneando únicamente rutas absolutas del sistema de archivos local (`/Users/...` normalizado a `~`) y preservando íntegramente las directrices de arquitectura, calidad, seguridad y gobernanza.

---

## 2. Contenido Íntegro Saneado del Contrato Operativo

Guía operativa para que agentes trabajen en este repositorio sin pisar cambios del usuario, introducir inconsistencias ni romper producción.

El contexto funcional y de producto detallado está en `README.md`. La documentación canónica por dominio vive en `docs/`.

---

### Sección 1. Reglas operativas obligatorias

Estas reglas tienen prioridad sobre cualquier optimización, refactor o atajo técnico.

#### Antes de modificar cualquier archivo
- Ejecutar `git status` antes de empezar.
- Asumir que cualquier cambio existente en el working tree pertenece al usuario.
- **Nunca** descartar, sobrescribir, hacer `stash`, `reset`, `checkout`, `restore`, revertir ni modificar cambios ajenos sin autorización explícita del usuario.
- Si existen cambios previos en archivos que también deben modificarse, preservarlos e integrar el nuevo trabajo alrededor de ellos.

#### Acciones destructivas y producción
- **Nunca ejecutar `DROP`, borrar datos, resetear la base de datos, eliminar recursos de Cloudflare/Vercel/Firebase/Supabase, rotar secretos ni realizar cambios irreversibles en producción sin autorización específica y explícita del usuario.**
- No asumir que una solicitud de “arreglar”, “migrar”, “limpiar” o “redeployar” autoriza operaciones destructivas.
- Antes de cualquier operación que pueda afectar producción, confirmar el entorno y el target exactos.

#### Commits y push
- Solo hacer commit o push cuando el usuario lo indique explícitamente.
- Los mensajes de commit deben escribirse en español.
- Usar **siempre** la identidad Git ya configurada (`Marcos2099x` / `marcos2099x@gmail.com`).
- **Nunca** usar `-c user.name=...`, `-c user.email=...` ni identidades alternativas. Vercel Hobby valida al autor contra el equipo de GitHub y rechaza el deploy si no coincide.

#### Definition of Done — antes de decir “terminado”
Antes de afirmar que un cambio está terminado:
1. Ejecutar los análisis, linters y tests aplicables al área modificada.
2. Revisar `git diff` y comprobar que el cambio corresponde al alcance solicitado.
3. Ejecutar `git status` y comprobar que no se hayan creado archivos accidentales, temporales o artefactos no deseados.
4. Verificar que la documentación relevante quedó sincronizada con el comportamiento actual.
5. Si alguna validación no puede ejecutarse o falla por una causa externa, informarlo explícitamente en lugar de asumir que el cambio quedó validado.

---

### Sección 2. MCP codebase-memory

Usar **siempre** el identificador de proyecto configurado en el servidor MCP para mantener la sincronización del grafo.
Para forzar re-indexado si hay desincronización estructural: `delete_project` seguido de `index_repository` (`mode=full`).

---

### Sección 3. Layout multi-paquete

- `lib/` — App Flutter (Riverpod + `go_router`). Entrada: `lib/main.dart`. Sin `build_runner`/codegen.
- `backend/` — API Node 24 / Express 5 con su propio `package.json` (`cd backend && npm install`). Entrada: `backend/src/index.js`.
- `cloudflare-frontend/` — Worker de Cloudflare (`xolotl-capital-web`) que sirve los assets estáticos del frontend en `https://xolotl-capital.com`. Se despliega automáticamente en cada push a `master`.
- `cloudflare-cron/` — Worker de Cloudflare (`xolotl-cron`) que dispara los crons del backend. Entrada: `cloudflare-cron/src/index.js`.
- `cloudflare-legacy/` — Worker legado (`xolotl-capital`) que solo hace redirects 301 desde `workers.dev` al dominio principal. No sirve contenido.
- `api/index.js` — Entrada serverless para Vercel (`module.exports = require('../backend/src/app')`). No editar como app separada.
- `supabase/migrations/` — Esquema canónico de BD y única fuente de verdad.
- El `package.json` de la raíz solo envuelve la CLI de Supabase (`npm run db:*` con `--workdir .`). No instalar dependencias del backend en la raíz.

---

### Sección 4. Arquitectura y convenciones de desarrollo

#### Backend
- **Contrato de errores obligatorio:** responder siempre con `{ error: { message, status, ...extra } }`.
- Los handlers deben estar envueltos con `asyncHandler` (`controllers/_baseController.js`) y lanzar `ApiError` (`utils/apiError.js`).
- No escribir `try/catch` + `res.status(500).json(...)` de forma manual para sustituir el contrato común.
- **Tres clientes de BD coexisten:** Sequelize, `pg.Pool` y Supabase JS. Revisar cuál usa el servicio antes de modificarlo.
- **Crons:** `node-cron` en `jobs/index.js` está inactivo en Vercel. Los crons reales son `/api/cron/*`, validados con `CRON_SECRET`, y los dispara el Worker `cloudflare-cron/` (`xolotl-cron`).
- **Sin modo mock:** `routes/_mock/` fue eliminado. Sin `DATABASE_URL`, la app falla rápido a propósito; ni `/healthz` responde. No existe fallback a datos simulados.

#### Frontend Flutter
- **Sin codegen:** no usar `build_runner`. Los providers de Riverpod se declaran a mano.
- **Navegación:** `go_router` está centralizado en `lib/config/router.dart` (`AppRoutes`). Usar `context.go` / `context.push`; usar `Navigator.pop` solo para cerrar diálogos.
- **URLs de API:** definirlas únicamente en `lib/config/constants.dart` (`ApiConstants`). No hardcodear URLs en pantallas.
- **Capas:** Pantallas → Providers → Services/Repositories → `api_client`.
- Las pantallas no importan directamente `http` ni `Supabase`.
- `lib/firebase_options.dart`: contiene API keys web públicas estándar de Firebase; no se considera una fuga de secretos.
- **Diseño “Anti-AI Slop” obligatorio:** toda decisión de UI/UX se rige por `docs/ui/ANTI_AI_SLOP_DESIGN_RULES.md`, que es la fuente única para esas reglas.
  - Antes de cerrar un cambio de frontend, recorrer la checklist final de esa guía.
  - Si el usuario rechaza o corrige un patrón no cubierto, agregar la regla a la guía en el mismo cambio (regla numerada + ítem en la checklist).
  - Antes de agregar una regla nueva, verificar que no exista ya con otra redacción. Si existe, ampliar la existente en vez de crear una duplicada.

---

### Sección 5. Base de Datos — Supabase/PostgreSQL

- **Fuente única:** `supabase/migrations/`. Todo cambio de esquema debe ser un nuevo archivo SQL con timestamp en esa carpeta.
- **Deprecados — no tocar ni editar:** `backend/migrations/` y `sequelize.sync({alter})`.
- Los scripts legacy `backend/scripts/migrate.js`, `create-tables.js` y `database-admin.js` ya no existen.
- El backend no expone scripts npm `db:*`; el esquema se gestiona únicamente con Supabase.
- **Grants de Data API (desde 2026-10-30):** toda migración que cree tablas, vistas o secuencias en `public` debe incluir sus `GRANT` para `service_role` (`SELECT, INSERT, UPDATE, DELETE` en tablas; `USAGE, SELECT` en secuencias). Sin grants a `anon`/`authenticated` por defecto. El guard `scripts/check_db_grants.sql` corre en el job `validate` de `supabase.yml` y falla si falta alguno. Detalle en `docs/system/DATA.md` §1.
- **Sin Docker local:** los comandos con `--local` (`db:start`, `db:reset`, `db:lint --local`) no funcionan sin Docker Desktop.
- Usar `--linked` para hablar con el proyecto remoto mediante la Management API cuando corresponda.
- Los wrappers `npm run db:lint` y `npm run db:reset` usan `--local` → **no usar**.
- La prohibición de operaciones destructivas de la sección 1 aplica especialmente a Supabase: ningún reset, borrado masivo, `DROP` o eliminación de recursos sin autorización específica del usuario.

---

### Sección 6. Calidad de código

- **Tamaño de archivos:** ningún archivo de código nuevo o modificado debe superar **1000 líneas**. Objetivo recomendado: **400–600 líneas**.
- Si un archivo crece más, dividirlo por responsabilidad (`widgets`, providers, helpers, etc.) antes de cerrar el cambio.
- **Archivos existentes que ya exceden el tope:** quedan congelados como deuda y no deben crecer. Cuando se toquen, deben dividirse cuando sea razonable.
- La lista de excepciones/deuda está en `docs/system/KNOWN_ISSUES.md`.
- Excepciones justificadas: catálogos de datos estáticos y herramientas de desarrollo.

---

### Sección 7. Secretos y configuración sensible

- **Nunca commitear:** `.env`, service accounts, `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN` ni llaves Firebase Admin. Todos deben permanecer cubiertos por `.gitignore`.
- `DATABASE_URL`: debe usar el pooler Supavisor, puerto **6543**, host `*.pooler.supabase.com`. No usar la conexión directa: Vercel puede agotar conexiones en serverless.
- No rotar secretos ni credenciales sin autorización explícita del usuario.
- No eliminar ni recrear recursos de Firebase, Supabase, Cloudflare o Vercel como mecanismo de diagnóstico salvo autorización específica.

---

### Sección 8. CI/CD y despliegues

#### Push a `master`
Un push a `master` despliega automáticamente a producción:
- **Vercel** redespliega el backend usando `api/index.js`.
- **Cloudflare** ejecuta `scripts/cloudflare_build.sh` y despliega el frontend estático mediante la integración Git del dashboard.
- **No ejecutar `wrangler deploy` manual después de un push** del frontend: duplicaría el despliegue.
- `supabase.yml` aplica migraciones nuevas en producción automáticamente cuando cambia `supabase/**`.

#### Despliegues separados
- Frontend Flutter web: `scripts/cloudflare_build.sh` + deploy automático del Worker estático en Cloudflare.
- Backend: Vercel.

#### Dominios de producción
- **Frontend:** `https://xolotl-capital.com` — Worker estático `xolotl-capital-web`.
- El Worker legado `xolotl-capital` conserva `https://xolotl-capital.marcos2099x.workers.dev` únicamente como redirect.
- **Backend:** `https://api.xolotl-capital.com` en Vercel (`https://xolotl-capital.vercel.app` como fallback técnico).
- La app web apunta al backend mediante `--dart-define=API_BASE_URL`.

#### Compatibilidad de errores
- El frontend ya tolera ambos shapes en `api_client.dart`: `{error:"str"}` y `{error:{message,status}}`.
- El refactor del contrato de errores del backend es retrocompatible con esa tolerancia.

---

### Sección 9. CLIs disponibles

Las siguientes CLIs ya están autenticadas contra el proyecto y pueden usarse para diagnóstico y despliegues, respetando siempre las reglas de seguridad de la sección 1:
- `gh` — GitHub: `gh run list`, `gh run view`, `gh pr`, `gh release`.
- `vercel` — Backend: `vercel ls`, `vercel logs <deployment-url>`, `vercel env ls`.
- `firebase` — Auth/Analytics/FCM: `firebase projects:list`, `firebase apps:list`.
- `supabase` — BD: usar la CLI local fijada en el lockfile. Los wrappers `npm run db:*` ya usan `--workdir .`. Preferir `--linked` cuando corresponda.
- `wrangler` — Cloudflare Workers: útil para diagnóstico (`wrangler tail`, `wrangler deployments list`).
  - El deploy del frontend es automático mediante integración Git; no usar `wrangler deploy` salvo que el usuario autorice específicamente un redeploy manual.
  - `wrangler.jsonc` es la fuente de verdad para `name` y `assets.directory`.
  - **No usar `wrangler pages deploy`**: este proyecto no usa Cloudflare Pages.
  - Para el Worker de cron: `cd cloudflare-cron && npm run tail`.
  - Si el usuario autoriza un deploy manual del cron: `npx wrangler deploy -c cloudflare-cron/wrangler.toml --name xolotl-cron`.
  - **Importante:** el `wrangler.jsonc` de la raíz corresponde al Worker legado. Cualquier comando `wrangler` dirigido al cron debe incluir `-c` explícito para evitar apuntar al Worker equivocado (verificado con Wrangler 4.125).

#### QA en navegador — Playwright + Edge con perfil guardado (`~/xolotl-qa/`)
Cuando el usuario pida “testea/probar/verificar la app en el navegador” (QA visual, consola, flujos), usar **siempre** este kit en lugar de operar su ventana real (Orca computer-use) o pedirle capturas:
- `cd ~/xolotl-qa && node qa-bridge.js` abre Edge (channel `msedge`) con el **perfil persistente** `edge-profile/` que ya conserva la sesión iniciada; solo el primer login es manual.
- Se maneja por archivos: `echo "<comando>" > cmd.txt` y leer `out.txt` (comandos y detalles en `~/xolotl-qa/README.md`).
- Viewport por defecto **393×1800** (pantallas completas sin depender de scroll), capturas en `~/xolotl-qa/png/`, y `log` devuelve consola (error/warn), `pageerror`, requests fallidas y HTTP≥400.
- QA desatendido: cambiar `headless: false` → `true` en `qa-bridge.js` (el perfil ya trae la sesión).
- El perfil y el kit viven **fuera del repo**: nunca commitearlos. Si el usuario pide explícitamente operar su sesión real, eso es Orca computer-use (ver `docs/system/BROWSER_DEBUGGING.md`).

**Regla general:** confirmar entorno y target antes de cualquier comando que pueda tocar producción.

---

### Sección 10. Landing pública y dominio

El repositorio principal sirve la app Flutter en `https://xolotl-capital.com`.
La landing de marketing vive en un repositorio separado:
- **Repo:** Repositorio privado de la landing (Next.js static export).
- **Deploy:** Worker estático en `https://landing.xolotl-capital.com`, con custom domain conectado por integración Git de Cloudflare.
- **SEO/canonical:** la landing apunta a sí misma (`landing.xolotl-capital.com/...`), no a `xolotl-capital.com`.
- **CTAs:** `/auth?returnTo=<destino>` y `/preregister?returnTo=<destino>` apuntan al dominio principal.
- La app valida destinos con allowlist en `lib/config/router.dart` para evitar open redirects y loops.

---

### Sección 11. Dashboard de Investigación — Tesis

Repositorio separado para el dashboard de investigación de la tesis sobre gamificación, tutor AI y aprendizaje de inversión:
- Es un dashboard Vite + React que consume `/api/research/*` de este backend.
- **URL:** `https://research.xolotl-capital.com` — Worker dedicado, custom domain, DNS + SSL automáticos.
- **Auth y proxy:** cookie `HttpOnly` HMAC-SHA256 en el Worker.
- El Worker inyecta `RESEARCH_API_KEY` server-side al llamar al backend; la key nunca llega al navegador.
- **Deploy:** manual mediante `npm run deploy` desde ese repositorio (`build` + `wrangler deploy`). No tiene integración Git.
- **Datos:** `user_competency_state_history` y `learning_user_weekly_snapshots` son la fuente longitudinal alimentada desde este backend.

---

### Sección 12. SEO del dominio principal

`xolotl-capital.com` es la app Flutter y no un sitio con contenido semántico estático.
- `web/index.html` no lleva JSON-LD ni canonical fijo porque la app es client-rendered.
- `web/index.html` declara `noindex, follow`.
- `web/sitemap.xml` está intencionalmente vacío.
- `web/robots.txt` usa `Allow: /` y referencia al sitemap.
- `web/index.html` carga Google Analytics (`gtag`) y `web/tts.js` para la síntesis de voz del tutor.
- No existe cookie flag del Worker para autenticación: el auth es 100% client-side en Flutter mediante Firebase IndexedDB + Firebase Auth.
- El Worker no bifurca contenido según el estado de autenticación.

---

### Sección 13. Documentación canónica

- La documentación vive en `docs/`, organizada por dominio (`docs/market/`, `docs/ranking/`, `docs/ui/`, etc.).
- Antes de tocar un dominio, consultar su documento de reglas correspondiente.
- Para cualquier cambio transversal, empezar por `docs/system/README.md`.
- `docs/system/` es la referencia maestra de frontend, backend, datos, plataformas, despliegue, crons, operación y problemas conocidos.
- Si durante el trabajo se define o descubre una regla, contrato o decisión importante, documentarla en la carpeta de `docs/` correspondiente siguiendo el patrón `<DOMINIO>_RULES.md`.

#### Documentación viva — obligatorio
- **Todo cambio debe actualizar la documentación del dominio que toca en el mismo cambio/commit.**
- Una documentación desactualizada respecto al comportamiento actual se considera un bug.
- Si el cambio altera comportamiento, reglas, contratos, datos o límites:
  - actualizar la documentación del dominio;
  - actualizar el documento maestro correspondiente;
  - actualizar la batería de QA manual si cambia el comportamiento observable.
- Cada dominio documentado debe tener un documento maestro o de reglas localizable desde `docs/`. Si no existe, crearlo antes de cerrar el cambio.
- La sincronización de documentación forma parte de la **Definition of Done** y debe comprobarse antes de afirmar que el trabajo está terminado.
