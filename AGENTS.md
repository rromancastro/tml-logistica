# com.panteasmart.lights

## Forma de trabajo acordada

### 1. Primero analisis, no codigo
- El usuario explica qué quiere resolver.
- Antes de escribir o modificar código, revisar el código existente en cualquier archivo relevante.
- La primera respuesta debe enfocarse en explicar qué haríamos según la estructura actual del proyecto.

### 2. Propuesta antes de tocar el repo
- Primero describir el enfoque de trabajo.
- Luego sugerir los cambios que habría que hacer.
- Si hace falta, mostrar ejemplos de código dentro del chat de Codex.
- Esos ejemplos son solo de referencia y no implican cambios en archivos.

### 3. No editar sin OK explicito
- No modificar archivos del proyecto hasta que el usuario dé el OK explícito.
- No adelantarse a implementar aunque el camino técnico ya esté claro.
- Si el usuario pide "pensemos", "decime qué harías", "mostrame un ejemplo" o algo similar, responder solo con análisis, propuesta y ejemplos en el chat.

### 4. Alcance acotado
- Si el usuario define que solo se puede tocar una función, un bloque o un archivo, respetar ese alcance.
- No tocar nada fuera de esa función o bloque sin avisar antes.
- Si para resolver bien el problema hace falta tocar algo adicional, primero explicarlo y pedir aprobación.

### 5. Implementacion solo despues de validar
- Una vez acordado el enfoque, proponer cambios concretos.
- Después, si el usuario da el OK, recién ahí editar archivos.
- Al implementar, limitarse a lo aprobado y avisar si aparece un impacto no previsto.

### 6. Estilo de colaboracion esperado
- Priorizar explicación clara sobre el código real que ya existe.
- Evitar inventar arquitectura nueva si no hace falta.
- Basar las propuestas en cómo está armado hoy el proyecto.
- Cuando el usuario pida ejemplos, darlos en el chat antes de modificar el código real.

### 7. Regla para cambios en el codigo
- Cada cambio en archivos de código debe dejar visible el código anterior comentado.
- Antes del código anterior comentado, explicar con un comentario por qué ese bloque viejo queda comentado.
- Antes del bloque nuevo, agregar un comentario corto explicando qué va a hacer el código nuevo.
- Después de esos comentarios, recién agregar el código nuevo.

- limpiar el texto con encoding roto.