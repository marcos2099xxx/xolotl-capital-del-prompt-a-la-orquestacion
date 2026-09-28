# Materiales Suplementarios: Del prompt a la orquestación agéntica

Repositorio público de materiales suplementarios, trazabilidad metodológica y artefactos documentales para el artículo científico:

> **Del prompt a la orquestación agéntica: desarrollo experiencial de Xolotl Capital, un simulador bursátil educativo**  
> **Autores:** Marcos Alberto Arias Ramírez<sup>1</sup>, Arturo Corona Ferreira<sup>1</sup>  
> <sup>1</sup>*Universidad Juárez Autónoma de Tabasco (UJAT), División Académica de Educación y Artes, Maestría en Tecnologías para el Aprendizaje.*  
> **Contacto:** `marcos2099x@gmail.com`, `arturo.corona@ujat.mx`

---

## 1. ¿Qué es Xolotl Capital?

**Xolotl Capital** es un simulador bursátil educativo multiplataforma (Web, Android, iOS) diseñado para apoyar la formación de inversionistas novatos mediante la toma de decisiones financieras fundamentadas. A diferencia de las plataformas comerciales o simuladores convencionales enfocados en métricas puramente especulativas, Xolotl Capital incorpora una capa pedagógica interactiva que:

1. **Interviene en tiempo real ante sesgos cognitivos** (aversión a la pérdida, exceso de confianza, comportamiento de rebaño y efecto de disposición) a través de pausas de reflexión socrática antes de ejecutar órdenes de compra/venta.
2. **Promueve el aprendizaje experiencial** estructurado a partir del modelo de Kolb (1984), vinculando la experiencia concreta en el mercado de valores con la observación reflexiva y la conceptualización abstracta.
3. **Provee tutoría adaptativa** asistida por inteligencia artificial, evaluando la justificación cualitativa de cada operación frente a las condiciones del mercado bursátil mexicano (BMV/SIC).

---

## 2. Propósito de este repositorio suplementario

El desarrollo de software asistido por modelos de lenguaje grande (LLMs) ha evolucionado rápidamente desde la generación de código mediante *prompts* aislados hasta arquitecturas complejas de *orquestación agéntica*. Sin embargo, gran parte de la literatura reporta resultados anecdóticos sin proporcionar trazabilidad empírica sobre las fricciones técnicas, fallas de contexto o mecanismos de gobernanza necesarios en proyectos de mediana y gran escala.

Este repositorio tiene como propósitos centrales:
- **Respaldo empírico:** Proporcionar la evidencia documental, técnica y cronológica que sustenta las afirmaciones del artículo.
- **Transparencia metodológica:** Transparentar la transición desde un prototipo monolítico en navegador (abril de 2026) hasta una arquitectura distribuida y multiplataforma supervisada por agentes autónomos y contratos operativos (mayo–septiembre de 2026).
- **Reproducibilidad y auditoría:** Ofrecer a evaluadores, investigadores y educadores acceso a los instrumentos pedagógicos originales (PDR), fragmentos de código conservados, matrices de asignación de roles y diffs históricos de incidentes técnicos.

---

## 3. Política de privacidad y preservación del código principal

> [!IMPORTANT]
> **El repositorio de producción de Xolotl Capital es privado y permanecerá privado.**

Este repositorio público de materiales suplementarios se apega a las siguientes directrices éticas y de seguridad:
- **Protección de propiedad intelectual:** No contiene el código fuente completo ni los modelos de datos propietarios que permitirían la reconstrucción comercial no autorizada del sistema.
- **Seguridad en infraestructura:** Se han omitido y sanitizado todas las credenciales de producción, cadenas de conexión a base de datos (`DATABASE_URL`), secretos de autenticación (`CRON_SECRET`, `RUN_SECRET`), llaves de servicio de Firebase/Supabase y URLs internas de infraestructura serverless.
- **Integridad de datos personales:** No se incluyen registros de usuarios reales, identificadores institucionales de alumnos ni datos de contacto no consentidos.
- **Foco científico:** Se publican exclusivamente los extractos representativos y mínimos necesarios para auditar la metodología y las conclusiones del artículo.

---

## 4. Estructura de carpetas y contenidos

El repositorio está organizado en las siguientes secciones temáticas:

| Directorio / Archivo | Descripción del contenido | Tipo de evidencia |
| :--- | :--- | :--- |
| [`pdr/`](pdr/) | **Product Design Document (PDR)** pedagógico original (*Guía PDR*, 28 de abril de 2026) que formalizó los fundamentos educativos y los sesgos a mitigar antes del desarrollo. | Documental primaria |
| [`prototipo/`](prototipo/) | Primera versión completa del prototipo web en SPA monolítica (28 de abril de 2026, 18 archivos ejecutables en navegador), catálogo BMV simulado, banco de preguntas socráticas y captura auténtica en modo oscuro. | Documental primaria |
| [`procedimiento/`](procedimiento/) | Descripción sistemática del procedimiento de desarrollo agéntico en 6 fases (Kolb), matriz operativa de roles humano-agente y extracto auditado del contrato operativo (`AGENTS.md`). | Sistematización metodológica |
| [`evidencias/`](evidencias/) | Documentación longitudinal de fricciones técnicas (cron inactivo, límite de 25s), inventario de modelos/herramientas y serie de capturas de pantalla auténticas del simulador actual en producción (`evidencias/capturas-simulador-actual/`). | Documental primaria / Diffs |
| [`paper/`](paper/) | Matriz exhaustiva de afirmación vs. evidencia con límites epistemológicos y cronología resumida verificada (abril–septiembre 2026). | Análisis de correspondencia |
| [`figuras/`](figuras/) | Fuentes editables (Mermaid, SVG) y renderizados PNG a 200 DPI de la **Figura 1** (Evolución de Xolotl Capital) y la **Figura 2** (Procedimiento metodológico en 6 fases). | Ilustrativa / Metodológica |
| [`MANIFEST.md`](MANIFEST.md) | Inventario formal con hashes criptográficos SHA-256 de todos los archivos del repositorio, indicando fuente original, transformaciones y sanitización. | Auditoría e integridad |
| [`CITATION.cff`](CITATION.cff) | Archivo normalizado de citación bibliográfica en formato Citation File Format (CFF 1.2.0). | Metadatos académicos |

---

## 5. Principio de rigor y epistemología de la evidencia

Para evitar sesgos de memoria y declaraciones no sustentadas, todos los materiales y aseveraciones se clasifican explícitamente bajo tres categorías epistemológicas:

1. **Evidencia documental verificable:** Registros con sello de tiempo comprobable en commits de Git, metadatos de archivos conservados (PDF/JS de abril de 2026), diffs de código y logs de despliegues.
2. **Reconstrucción retrospectiva fundamentada:** Procedimientos, intenciones de diseño y flujos de trabajo descritos por los autores a partir de sus notas de campo y bitácoras, claramente señalados cuando no existe una traza técnica automatizada.
3. **Sistematización metodológica:** Modelado analítico y formalización de fases (por ejemplo, el mapeo del desarrollo hacia el ciclo de Kolb de 1984) elaborado durante la redacción del manuscrito.

---

## 6. Alcance y limitaciones

- **Naturaleza de los artefactos:** Los fragmentos de código en `prototipo/` corresponden a un estado temprano de validación rápida y no reflejan la arquitectura modular actual construida en Flutter 3.x y Express 5.
- **Independencia funcional:** Los archivos de código seleccionados son estáticos y con fines de lectura; no están diseñados como una librería ejecutable independiente fuera de su contexto original de demostración.
- **Entorno pedagógico:** El simulador opera en un entorno formativo controlado; ningún módulo aquí expuesto debe ser considerado como asesoría financiera, recomendación de inversión ni garantía de rendimiento patrimonial.

---

## 7. Cómo citar este trabajo

Si estos materiales o la metodología de orquestación agéntica resultan útiles para su investigación, por favor cite el trabajo utilizando los siguientes formatos:

### Formato BibTeX
```bibtex
@article{arias_corona_2026_orquestacion,
  author    = {Arias Ram{\'i}rez, Marcos Alberto and Corona Ferreira, Arturo},
  title     = {Del prompt a la orquestaci{\'o}n ag{\'e}ntica: desarrollo experiencial de Xolotl Capital, un simulador burs{\'a}til educativo},
  year      = {2026},
  publisher = {Universidad Ju{\'a}rez Aut{\'o}noma de Tabasco},
  note      = {Materiales suplementarios en repositorio p{\'u}blico independiente}
}
```

Para mayor detalle de metadatos bibliográficos, consulte el archivo [`CITATION.cff`](CITATION.cff).
