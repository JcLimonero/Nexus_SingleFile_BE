<?php
/**
 * Helper para convertir texto a Title Case
 * 
 * Esta función convierte texto de MAYÚSCULAS o minúsculas a formato Title Case,
 * manteniendo acrónimos en mayúsculas y preposiciones en minúsculas.
 * 
 * @param string $text Texto a convertir
 * @return string Texto en Title Case
 */
function toTitleCase($text) {
    if (empty($text)) {
        return $text;
    }
    
    // Lista de palabras que deben permanecer en mayúsculas (acrónimos)
    $acronyms = [
        'ID', 'RFC', 'CURP', 'CFDI', 'PDI', 'VGD', 'REPUVE', 'AISE', 
        'PROFECO', 'KIA', 'IF', 'DCTO', 'IFE', 'VGD', 'AISE'
    ];
    
    // Lista de palabras que deben permanecer en minúsculas (preposiciones, artículos)
    $lowercaseWords = [
        'de', 'del', 'la', 'el', 'y', 'o', 'a', 'en', 'por', 'para', 
        'con', 'sin', 'las', 'los', 'un', 'una', 'unos', 'unas'
    ];
    
    // Convertir a minúsculas primero
    $text = mb_strtolower($text, 'UTF-8');
    
    // Dividir en palabras
    $words = preg_split('/\s+/', trim($text));
    $result = [];
    
    foreach ($words as $index => $word) {
        $word = trim($word);
        if (empty($word)) {
            continue;
        }
        
        // Verificar si es un acrónimo conocido
        $isAcronym = false;
        $wordUpper = mb_strtoupper($word, 'UTF-8');
        foreach ($acronyms as $acronym) {
            if ($wordUpper === $acronym) {
                $result[] = $acronym;
                $isAcronym = true;
                break;
            }
        }
        
        if ($isAcronym) {
            continue;
        }
        
        // Primera palabra siempre en mayúscula
        // Palabras intermedias en minúsculas si están en la lista
        if ($index > 0 && in_array($word, $lowercaseWords)) {
            $result[] = $word;
        } else {
            // Capitalizar primera letra
            $result[] = mb_strtoupper(mb_substr($word, 0, 1, 'UTF-8'), 'UTF-8') . 
                       mb_substr($word, 1, null, 'UTF-8');
        }
    }
    
    return implode(' ', $result);
}
