#!/usr/bin/env node

/**
 * Script mejorado para eliminar todos los console.log, console.warn y console.error
 * de los archivos TypeScript del frontend
 * Maneja casos multi-línea y objetos complejos
 */

const fs = require('fs');
const path = require('path');

// Directorio base del frontend
const FE_DIR = path.join(__dirname, 'src');

// Contador de archivos procesados
let filesProcessed = 0;
let totalRemoved = 0;

/**
 * Elimina console.log, console.warn y console.error de un archivo
 * Maneja casos multi-línea y objetos complejos
 */
function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Función para eliminar console statements, incluyendo multi-línea
    function removeConsoleStatement(match, p1, p2, offset, string) {
      // p1 es el tipo (log, warn, error)
      // p2 es el contenido completo del paréntesis
      
      // Contar paréntesis para encontrar el cierre correcto
      let depth = 1;
      let i = match.length;
      let inString = false;
      let stringChar = null;
      
      while (i < string.length && depth > 0) {
        const char = string[offset + i];
        
        if (!inString) {
          if (char === '(') depth++;
          else if (char === ')') depth--;
          else if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
          }
        } else {
          if (char === stringChar && string[offset + i - 1] !== '\\') {
            inString = false;
            stringChar = null;
          }
        }
        i++;
      }
      
      // Encontrar el punto y coma opcional después del paréntesis de cierre
      let j = offset + i;
      while (j < string.length && (string[j] === ';' || /\s/.test(string[j]))) {
        if (string[j] === ';') {
          j++;
          break;
        }
        j++;
      }
      
      return string.substring(0, offset) + string.substring(j);
    }
    
    // Patrón mejorado que captura console.log/warn/error con su contenido
    // Maneja: console.log('simple')
    //         console.log('multi', obj)
    //         console.log(`template`)
    //         console.log({
    //           multi: 'line',
    //           object: true
    //         })
    const consolePattern = /console\.(log|warn|error)\s*\(/g;
    
    let match;
    let removed = 0;
    let lastIndex = 0;
    const newContent = [];
    
    while ((match = consolePattern.exec(content)) !== null) {
      // Agregar el contenido antes del match
      newContent.push(content.substring(lastIndex, match.index));
      
      // Encontrar el cierre del paréntesis
      let depth = 1;
      let i = match.index + match[0].length;
      let inString = false;
      let stringChar = null;
      let foundSemicolon = false;
      
      while (i < content.length && depth > 0) {
        const char = content[i];
        
        if (!inString) {
          if (char === '(') depth++;
          else if (char === ')') {
            depth--;
            if (depth === 0) {
              i++;
              // Buscar punto y coma opcional
              while (i < content.length && /\s/.test(content[i])) i++;
              if (i < content.length && content[i] === ';') {
                i++;
                foundSemicolon = true;
              }
              break;
            }
          } else if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
          }
        } else {
          if (char === stringChar && content[i - 1] !== '\\') {
            inString = false;
            stringChar = null;
          }
        }
        i++;
      }
      
      // Si encontramos el cierre completo, saltamos esta parte
      if (depth === 0) {
        removed++;
        lastIndex = i;
      } else {
        // Si no encontramos el cierre, mantener el contenido (error en el código)
        newContent.push(content.substring(match.index, i));
        lastIndex = i;
      }
    }
    
    // Agregar el resto del contenido
    newContent.push(content.substring(lastIndex));
    
    content = newContent.join('');
    
    // Limpiar líneas vacías múltiples (máximo 2 líneas vacías consecutivas)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Solo escribir si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesProcessed++;
      totalRemoved += removed;
      console.log(`✓ ${path.relative(FE_DIR, filePath)}: ${removed} console statements removed`);
      return removed;
    }
    
    return 0;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Recorre recursivamente un directorio buscando archivos .ts
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Ignorar node_modules, dist, .git, etc.
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.angular', 'build'].includes(entry.name)) {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      // Verificar si el archivo contiene console.log/warn/error
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/console\.(log|warn|error)/.test(content)) {
        removeConsoleLogs(fullPath);
      }
    }
  }
}

// Ejecutar el script
console.log('🔍 Buscando archivos con console.log, console.warn o console.error...\n');
processDirectory(FE_DIR);

console.log(`\n✅ Proceso completado:`);
console.log(`   - Archivos procesados: ${filesProcessed}`);
console.log(`   - Total de console statements eliminados: ${totalRemoved}`);
