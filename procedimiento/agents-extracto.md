# Extracto Saneado de `AGENTS.md`: Memoria Externa y Contrato Operativo

> **Conceptualización epistemológica:** En este proyecto, el archivo `AGENTS.md` **no representa una memoria cognitiva biológica ni un estado neural interno del modelo de lenguaje**, dado que las llamadas a las APIs de modelos de lenguaje carecen de estado (*stateless*). En su lugar, actúa como una **memoria externa persistente y un contrato operativo explícito** inyectado en la ventana de contexto de cada sesión de desarrollo. Su función es reducir la pérdida de contexto entre sesiones independientes, delimitar fronteras de seguridad y codificar el aprendizaje institucional derivado de incidentes previos.

---

## 1. Ficha del Documento de Origen

- **Ruta original en el repositorio privado:** `/AGENTS.md`
- **Extensión total:** 361 líneas.
- **Snapshot representativo:** Estado del repositorio al 26 de septiembre de 2026 (consolidación de reglas tras 1,270 commits y resolución de deuda técnica X10).
- **Criterio de saneamiento:** Se excluyen configuraciones de infraestructura sensible (nombres de workers legados, IDs de proyectos internos, parámetros de base de datos) y se conservan las reglas de supervisión, calidad y gobierno citadas en el artículo.

---

## 2. Extractos Operativos Saneados

### Extracto A: Diagnóstico Previo y Preservación del Trabajo Humano

- **Ruta original:** `AGENTS.md` (Sección 1: *Reglas operativas obligatorias*)
- **Propósito:** Prevenir que el agente sobrescriba, descarte o modifique cambios no confirmados del usuario humano, exigiendo una inspección de estado antes de cualquier acción.
- **Contenido omitido por seguridad:** Ninguno.

```markdown
### Antes de modificar cualquier archivo

- Ejecutar `git status` antes de empezar.
    
- Asumir que cualquier cambio existente en el working tree pertenece al usuario.
    
- **Nunca** descartar, sobrescribir, hacer `stash`, `reset`, `checkout`, `restore`, revertir ni modificar cambios ajenos sin autorización explícita del usuario.
    
- Si existen cambios previos en archivos que también deben modificarse, preservarlos e integrar el nuevo trabajo alrededor de ellos.
```

---

### Extracto B: Prohibición Estricta de Operaciones Destructivas

- **Ruta original:** `AGENTS.md` (Sección 1: *Acciones destructivas y producción*)
- **Propósito:** Eliminar el riesgo de pérdida irreversible de datos o infraestructura provocada por acciones autónomas no deseadas del agente.
- **Contenido omitido por seguridad:** Se anonimizaron referencias a nombres específicos de proyectos en plataformas cloud.

```markdown
### Acciones destructivas y producción

- **Nunca ejecutar** `**DROP**`**, borrar datos, resetear la base de datos, eliminar recursos de Cloudflare/Vercel/Firebase/Supabase, rotar secretos ni realizar cambios irreversibles en producción sin autorización específica y explícita del usuario.**
    
- No asumir que una solicitud de “arreglar”, “migrar”, “limpiar” o “redeployar” autoriza operaciones destructivas.
    
- Antes de cualquier operación que pueda afectar producción, confirmar el entorno y el target exactos.
```

---

### Extracto C: Control Humano sobre Commits y Despliegues

- **Ruta original:** `AGENTS.md` (Sección 1: *Commits y push*)
- **Propósito:** Garantizar que la autoría y la sincronización con ramas remotas permanezca bajo control humano estricto, dado que en este proyecto un push a `master` dispara el despliegue automático a producción.
- **Contenido omitido por seguridad:** Ninguno (el autor valida que su correo institucional/académico figure en el proyecto).

```markdown
### Commits y push

- Solo hacer commit o push cuando el usuario lo indique explícitamente.
    
- Los mensajes de commit deben escribirse en español.
    
- Usar **siempre** la identidad Git ya configurada (`Marcos2099x` / `marcos2099x@gmail.com`).
    
- **Nunca** usar `-c user.name=...`, `-c user.email=...` ni identidades alternativas. Vercel Hobby valida al autor contra el equipo de GitHub y rechaza el deploy si no coincide.
```

---

### Extracto D: Protocolo de "Definition of Done" (Criterio de Aceptación)

- **Ruta original:** `AGENTS.md` (Sección 1: *Definition of Done — antes de decir “terminado”*)
- **Propósito:** Prohibir que el agente declare una tarea como completada sin haber ejecutado verificaciones objetivas (análisis estático, pruebas, diff y documentación).
- **Contenido omitido por seguridad:** Ninguno.

```markdown
### Definition of Done — antes de decir “terminado”

Antes de afirmar que un cambio está terminado:

1. Ejecutar los análisis, linters y tests aplicables al área modificada.
    
2. Revisar `git diff` y comprobar que el cambio corresponde al alcance solicitado.
    
3. Ejecutar `git status` y comprobar que no se hayan creado archivos accidentales, temporales o artefactos no deseados.
    
4. Verificar que la documentación relevante quedó sincronizada con el comportamiento actual.
    
5. Si alguna validación no puede ejecutarse o falla por una causa externa, informarlo explícitamente en lugar de asumir que el cambio quedó validado.
```

---

### Extracto E: Documentación Viva Obligatoria

- **Ruta original:** `AGENTS.md` (Sección 13: *Documentación viva — obligatorio*)
- **Propósito:** Codificar la regla de que cualquier modificación de código debe actualizar la documentación del dominio en el mismo commit, transformando la documentación técnica en una memoria evolutiva del software.
- **Contenido omitido por seguridad:** Ninguno.

```markdown
### Documentación viva — obligatorio

- **Todo cambio debe actualizar la documentación del dominio que toca en el mismo cambio/commit.**
    
- Una documentación desactualizada respecto al comportamiento actual se considera un bug.
    
- Si el cambio altera comportamiento, reglas, contratos, datos o límites:
    
    - actualizar la documentación del dominio;
        
    - actualizar el documento maestro correspondiente;
        
    - actualizar la batería de QA manual si cambia el comportamiento observable.
        
- Cada dominio documentado debe tener un documento maestro o de reglas localizable desde `docs/`. Si no existe, crearlo antes de cerrar el cambio.
    
- La sincronización de documentación forma parte de la **Definition of Done** y debe comprobarse antes de afirmar que el trabajo está terminado.
```

---

## 3. Síntesis Metodológica

El análisis de estos extractos evidencia cómo el flujo de trabajo evolucionó desde la simple formulación de prompts hacia una **gobernanza agéntica estructurada**. Mediante `AGENTS.md`, el agente queda sujeto a:
1. Límites operacionales negativos (qué tiene prohibido hacer sin autorización).
2. Protocolos de verificación positiva (qué pruebas debe demostrar haber superado).
3. Mecanismos de persistencia documental (cómo se actualiza la memoria compartida del repositorio).
