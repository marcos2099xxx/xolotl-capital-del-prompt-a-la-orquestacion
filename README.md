# Xolotl Capital: Del prompt a la orquestación agéntica

<div align="center">

[![Paper](https://img.shields.io/badge/Paper-Short%20Paper%20(MTAC--UJAT)-0052cc.svg?style=for-the-badge&logo=googlescholar&logoColor=white)](#cómo-citar-este-trabajo)
[![Flutter](https://img.shields.io/badge/Flutter-3.x%20Web%20%7C%20Mobile-02569B.svg?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Backend](https://img.shields.io/badge/Node.js-24%20%7C%20Express%205-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Database](https://img.shields.io/badge/PostgreSQL-17%20(Supabase)-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20%2B%20Cron-F38020.svg?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Integrity](https://img.shields.io/badge/Integridad-SHA--256%20Verificado-2ea44f.svg?style=for-the-badge&logo=checkmarx&logoColor=white)](MANIFEST.md)

<p align="center">
  <strong>Materiales suplementarios, trazabilidad metodológica y artefactos documentales para el artículo científico:</strong><br>
  <em>“Del prompt a la orquestación agéntica: desarrollo experiencial de Xolotl Capital, un simulador bursátil educativo”</em>
</p>

<p align="center">
  <strong>Autores:</strong> 
  <a href="mailto:marcos2099x@gmail.com">Marcos Alberto Arias Ramírez</a><sup>1</sup> &nbsp;|&nbsp; 
  <a href="mailto:arturo.corona@ujat.mx">Arturo Corona Ferreira</a><sup>1</sup><br>
  <sup>1</sup><em>Universidad Juárez Autónoma de Tabasco (UJAT) — División Académica de Educación y Artes<br>Maestría en Tecnologías para el Aprendizaje y el Conocimiento</em>
</p>

</div>

---

## 🧭 Tabla de Contenidos

1. [¿Qué es Xolotl Capital?](#-qué-es-xolotl-capital)
2. [Propósito del Repositorio Suplementario](#-propósito-del-repositorio-suplementario)
3. [Política de Privacidad y Preservación de Código](#-política-de-privacidad-y-preservación-de-código)
4. [Estructura del Repositorio y Artefactos](#-estructura-del-repositorio-y-artefactos)
5. [Cifras y Evidencia Empírica del Proyecto](#-cifras-y-evidencia-empírica-del-proyecto)
6. [Guía Rápida de Exploración Local](#-guía-rápida-de-exploración-local)
7. [Principio de Rigor y Epistemología de la Evidencia](#-principio-de-rigor-y-epistemología-de-la-evidencia)
8. [Cómo Citar este Trabajo](#-cómo-citar-este-trabajo)

---

## 📈 ¿Qué es Xolotl Capital?

**Xolotl Capital** es un simulador bursátil educativo multiplataforma (Web, Android, iOS) diseñado para apoyar la formación financiera de inversionistas principiantes mediante la toma de decisiones fundamentadas. A diferencia de las plataformas comerciales o simuladores convencionales enfocados en la especulación rápida, Xolotl Capital incorpora una capa pedagógica interactiva que:

* 🧠 **Interviene en tiempo real ante sesgos cognitivos:** Detecta patrones de *aversión a la pérdida*, *exceso de confianza*, *comportamiento de rebaño* y *efecto de disposición*, interrumpiendo órdenes impulsivas mediante pausas socráticas de reflexión obligatoria.
* 🔄 **Estructura el aprendizaje experiencial (Kolb, 1984):** Articula la experiencia concreta en el mercado bursátil mexicano (BMV/SIC) con la observación reflexiva y la conceptualización abstracta.
* 🤖 **Tutoría adaptativa basada en IA:** Provee andamiaje conceptual dinámico, evaluando el razonamiento cualitativo del usuario antes de desplegar el resultado financiero de sus operaciones.

---

## 🎯 Propósito del Repositorio Suplementario

El desarrollo de software asistido por inteligencia artificial generativa ha evolucionado vertiginosamente desde la generación de código mediante *prompts* aislados hasta arquitecturas complejas de *orquestación agéntica*. Sin embargo, gran parte de la literatura reporta resultados anecdóticos sin proporcionar trazabilidad empírica sobre las fricciones técnicas, los límites de contexto o los mecanismos de gobernanza indispensables en proyectos de mediana y gran escala.

Este repositorio público independiente tiene como objetivos:

1. **Aportar respaldo empírico auditable:** Proporcionar la evidencia documental, técnica y cronológica que sustenta cada afirmación del artículo.
2. **Transparentar la evolución metodológica:** Documentar el tránsito desde un prototipo monolítico en navegador (abril de 2026) hasta una arquitectura distribuida y multiplataforma supervisada por múltiples agentes autónomos bajo contratos operativos (mayo–septiembre de 2026).
3. **Facilitar la reproducibilidad académica:** Permitir a evaluadores, investigadores y educadores examinar el instrumento pedagógico original (PDR), ejecutar el prototipo web completo de forma offline y auditar los diffs históricos de incidentes en serverless.

---

## 🛡️ Política de Privacidad y Preservación de Código

> [!IMPORTANT]
> **El repositorio de producción de Xolotl Capital es privado y permanecerá privado.**

Este repositorio público independiente se rige por estrictas directrices éticas y de ciberseguridad:

* 🔒 **Protección de propiedad intelectual:** No contiene el código fuente completo de producción ni los modelos de datos propietarios que permitirían la clonación comercial no autorizada del sistema.
* 🚫 **Seguridad en infraestructura:** Se han omitido y sanitizado todas las credenciales de producción, cadenas de conexión a base de datos (`DATABASE_URL`), secretos de autenticación (`CRON_SECRET`, `RUN_SECRET`), llaves de servicio de Firebase/Supabase y URLs internas serverless.
* 👤 **Integridad de datos personales:** No se incluyen registros de usuarios reales, datos de alumnos de la universidad ni trazas de telemetría con identificadores personales.
* 🔬 **Foco exclusivamente científico:** Se publican únicamente los artefactos históricos y extractos representativos necesarios para validar las hipótesis y conclusiones del estudio de caso.

---

## 📂 Estructura del Repositorio y Artefactos

El repositorio contiene **48 artefactos auditados**, organizados en las siguientes carpetas temáticas:

```text
xolotl-capital-del-prompt-a-la-orquestacion/
├── 📄 CITATION.cff                        # Metadatos normalizados CFF 1.2.0 para citación
├── 🔐 MANIFEST.md                         # Inventario criptográfico exhaustivo con SHA-256
├── 📘 README.md                           # Guía principal de materiales suplementarios
│
├── 📋 pdr/                                # PRODUCT REQUIREMENTS DOCUMENT PEDAGÓGICO
│   ├── pdr-version-publica.pdf            # PDR original (14 páginas, 28-Abr-2026) saneado
│   └── README.md                          # Metadatos del documento, autoría y elementos auditados
│
├── 🌐 prototipo/                          # PRIMERA VERSIÓN COMPLETA (ABRIL DE 2026)
│   ├── README.md                          # Arquitectura de la SPA y guía de ejecución local
│   ├── capturas/                          # Captura auténtica de la interfaz en modo oscuro
│   │   ├── prototipo-web-abril-2026-mercado.png
│   │   └── README.md
│   └── codigo-completo/                   # Código fuente completo (18 archivos ejecutables)
│       ├── index.html                     # SPA monolítica, CDN Tailwind y Chart.js
│       ├── manifest.json / sw.js          # Configuración PWA y Service Worker offline
│       ├── data/assets.js                 # Catálogo inicial de 15 activos bursátiles simulados
│       └── js/ (15 módulos)               # ai-socratic, portfolio, gamification, market, etc.
│
├── ⚙️ procedimiento/                      # GOBERNANZA Y FORMALIZACIÓN METODOLÓGICA
│   ├── procedimiento-seis-fases.md        # Procedimiento agéntico sistemático (Kolb, 1984)
│   ├── matriz-operativa.md                # Matriz Insumo -> Agente -> Humano -> Salida
│   └── agents-extracto.md                 # Contrato operativo AGENTS.md íntegro (13 secciones)
│
├── 🔍 evidencias/                         # TRAZABILIDAD Y PRUEBAS LONGITUDINALES
│   ├── herramientas-y-modelos.md          # Inventario y triangulación temporal de modelos
│   ├── ordenes-programadas.md             # Caso longitudinal de tareas en serverless
│   ├── junio-2026-cron-inactivo.md        # Commit 8936ce8b (fix de drenado on-demand)
│   ├── agosto-2026-limite-tiempo.md       # Commit 8a8837e4 (presupuesto preventivo 25s)
│   └── capturas-simulador-actual/         # Galería auténtica del simulador en producción
│       ├── 01-dashboard-inicio-movil.jpeg
│       ├── 02-mercados-cotizaciones-movil.jpeg
│       ├── 03-detalle-activo-bimboa-movil.jpeg
│       ├── 04-dashboard-escritorio-responsive.png
│       └── README.md
│
├── 📊 figuras/                            # DIAGRAMAS VECTORIALES EDITABLES Y RENDERIZADOS
│   ├── figura-1-evolucion/                # Línea de tiempo evolutiva en tres etapas (SVG / PNG)
│   └── figura-2-procedimiento/            # Flujograma metodológico en 6 fases (Mermaid / SVG / PNG)
│
└── 📝 paper/                              # CORRESPONDENCIA CON EL MANUSCRITO
    ├── evidencia-del-articulo.md          # Matriz de correspondencia Afirmación vs. Evidencia
    └── cronologia-resumida.md             # Cronología comprobada con timestamps (Abril–Septiembre)
```

---

## 📊 Cifras y Evidencia Empírica del Proyecto

Para contextualizar la escala del sistema analizado en el artículo, se presentan las métricas de desarrollo verificables:

| Dimensión de Ingeniería | Métrica Verificable | Evidencia de Respaldo |
| :--- | :--- | :--- |
| **Historial de Desarrollo** | **1,270 commits** | Repositorio Git privado (Mayo – Septiembre de 2026). |
| **Pruebas Automatizadas** | **1,544 tests unitarios y de integración** | Suite Flutter en 281 archivos + 172 tests en backend. |
| **Evolución de Base de Datos** | **131 migraciones SQL versionadas** | Directorio `supabase/migrations/` como fuente canónica. |
| **Arquitectura de Frontend** | **789 archivos Dart** | Código modular en Flutter 3.x (`lib/`). |
| **Catálogo de Mercado** | **>212 activos bursátiles** | Cotizaciones en tiempo real BMV y SIC (~15 min retraso). |
| **Contrato Operativo de IA** | **13 secciones (361 líneas)** | [`procedimiento/agents-extracto.md`](procedimiento/agents-extracto.md). |
| **Artefactos Suplementarios** | **48 archivos públicos verificados** | [`MANIFEST.md`](MANIFEST.md) con hashes SHA-256. |

---

## 🚀 Guía Rápida de Exploración Local

### 1. Ejecutar el Prototipo Web Completo (Abril de 2026)
El prototipo original de 18 archivos es totalmente autocontenido y funciona de forma estática en cualquier navegador:

```bash
# 1. Clonar o ingresar a la carpeta del prototipo
cd prototipo/codigo-completo

# 2. Iniciar un servidor web local
python3 -m http.server 8000

# 3. Abrir en el navegador:
# http://localhost:8000
```

### 2. Verificar la Integridad Criptográfica de los Archivos
Todos los artefactos cuentan con su firma criptográfica en [`MANIFEST.md`](MANIFEST.md). Para verificar cualquier archivo:

```bash
# Ejemplo: verificar el PDR pedagógico original
shasum -a 256 pdr/pdr-version-publica.pdf
# Hash esperado: 48355a6b9ec24ff5b6dcab11bd96cb07610f6f04e6beaddeb1198ab19ccdb2fc
```

---

## ⚖️ Principio de Rigor y Epistemología de la Evidencia

Para evitar sesgos retrospectivos o declaraciones infundadas, toda la información de este repositorio se clasifica bajo tres categorías epistemológicas explícitas:

1. 🟢 **Evidencia documental verificable:** Registros con sello de tiempo en commits de Git, metadatos en archivos conservados (PDF/JS de abril de 2026), diffs de código y capturas de producción.
2. 🟡 **Reconstrucción retrospectiva fundamentada:** Intenciones de diseño, decisiones arquitectónicas y flujos de trabajo reportados por los autores a partir de sus notas de campo, claramente señalados cuando no existe una traza técnica automatizada.
3. 🔵 **Sistematización metodológica:** Formalización analítica y modelado de fases (como el mapeo hacia el ciclo de Kolb de 1984) elaborado durante la redacción del artículo.

---

## 📚 Cómo Citar este Trabajo

Si estos materiales, el protocolo de desarrollo o el contrato operativo resultan de utilidad para su investigación, por favor cite el trabajo utilizando el siguiente formato:

### Formato BibTeX
```bibtex
@article{arias_corona_2026_orquestacion,
  author    = {Arias Ram{\'i}rez, Marcos Alberto and Corona Ferreira, Arturo},
  title     = {Del prompt a la orquestaci{\'o}n ag{\'e}ntica: desarrollo experiencial de Xolotl Capital, un simulador burs{\'a}til educativo},
  year      = {2026},
  publisher = {Universidad Ju{\'a}rez Aut{\'o}noma de Tabasco},
  note      = {Materiales suplementarios y trazabilidad metodol{\'o}gica en repositorio p{\'u}blico independiente},
  url       = {https://github.com/Marcos2099x/xolotl-capital-del-prompt-a-la-orquestacion}
}
```

Para mayor detalle de metadatos bibliográficos normalizados, consulte el archivo [`CITATION.cff`](CITATION.cff).
