Actuá como un arquitecto senior Angular experto en buenas prácticas modernas.

Voy a pasarte código de un componente Angular existente separado en 3 archivos:

1. HTML
2. CSS
3. TypeScript

Tu tarea es refactorizarlo y transformarlo en una estructura Angular moderna, limpia y mantenible, separando el componente grande en componentes más pequeños según responsabilidades visuales y funcionales.

Contexto técnico:
- Usar Angular moderno.
- Usar componentes standalone.
- Usar `ChangeDetectionStrategy.OnPush`.
- Usar `input()` y `output()` en lugar de `@Input()` y `@Output()`.
- Usar signals para estado local cuando corresponda.
- Usar `computed()` para estado derivado cuando corresponda.
- Usar `@if`, `@for` y `@switch` en lugar de `*ngIf`, `*ngFor` y `*ngSwitch`.
- Evitar `any`.
- Evitar lógica compleja en el HTML.
- No usar `ngClass`; preferir bindings de clase como `[class.activo]="condicion"`.
- No usar `ngStyle`; preferir clases CSS o bindings puntuales.
- Mantener HTML semántico y accesible.
- Mantener el CSS separado por componente.
- Mantener los estilos globales en `styles.css` solamente si realmente corresponde.
- No mezclar HTML, CSS y TS en un mismo archivo.
- No usar inline styles salvo casos mínimos y justificados.
- Respetar exactamente los textos existentes.
- Respetar lo más posible el diseño visual actual.
- No borrar funcionalidades.
- No inventar contenido.

Objetivo:
Tomar el componente actual y dividirlo en componentes Angular reutilizables, manteniendo la lógica clara y los estilos ordenados.

Quiero que hagas lo siguiente:

1. Analizá el HTML, CSS y TS actuales.
2. Detectá las secciones visuales principales.
3. Detectá qué partes deberían convertirse en componentes hijos.
4. Detectá qué datos deberían pasar por `input()`.
5. Detectá qué eventos deberían emitirse con `output()`.
6. Detectá lógica que debería quedarse en el componente padre.
7. Detectá lógica que debería moverse a componentes hijos.
8. Detectá datos repetidos y convertílos en arrays tipados.
9. Reemplazá estructuras repetidas por `@for`.
10. Reemplazá condicionales por `@if`.
11. Conservá el comportamiento existente del TypeScript.
12. Mejorá nombres de variables y métodos solo si aporta claridad.
13. No rompas la API pública del componente salvo que expliques claramente el cambio.
14. Separá los estilos correspondientes a cada componente.
15. Si hay estilos compartidos, proponé moverlos a `styles.css` o a un archivo común.
16. Si hay formularios, mantener o migrar correctamente a Reactive Forms.
17. Si hay lógica de estado, usar signals cuando sea conveniente.
18. Si hay llamadas a servicios, mantenerlas en el componente padre o moverlas a un facade/service si corresponde.
19. Si hay código ambiguo, dejar comentarios `// TODO:` explicando qué habría que validar.

Antes del código final, devolveme este resumen:

## Análisis

- Qué hace el componente actual
- Secciones detectadas
- Problemas o mejoras encontradas
- Componentes propuestos
- Qué queda en el componente padre
- Qué se mueve a componentes hijos
- Inputs propuestos
- Outputs propuestos
- Estilos globales vs estilos por componente

## Estructura propuesta

Mostrame una estructura como esta:

src/app/features/nombre-feature/
  nombre-feature.component.ts
  nombre-feature.component.html
  nombre-feature.component.css

src/app/features/nombre-feature/components/nombre-hijo/
  nombre-hijo.component.ts
  nombre-hijo.component.html
  nombre-hijo.component.css

## Código final

Después generá el código completo archivo por archivo.

Reglas importantes:
- No omitas archivos.
- No uses pseudocódigo.
- No mezcles HTML, CSS y TS.
- Cada componente debe tener sus 3 archivos separados.
- El código debe poder copiarse y pegarse.
- No expliques teoría larga.
- Si asumís algo, agregá una sección llamada `Supuestos`.
- Si detectás que algo no conviene componentizar, explicá por qué.
- No componentices por componentizar. Separá solo donde tenga sentido.


Además, si ya existen clases CSS personalizadas del proyecto, como `.grilla`, `.col-x-6`, `.rayado`, `.stack`, `.bloque`, `.modal`, etc., no las reemplaces por frameworks externos. Reutilizalas y reorganizalas de forma limpia.
