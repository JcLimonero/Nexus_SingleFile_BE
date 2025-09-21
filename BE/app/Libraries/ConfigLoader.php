<?php

namespace App\Libraries;

/**
 * ConfigLoader - Carga configuración desde archivos JSON externos
 * 
 * Permite modificar la configuración de la aplicación directamente en el servidor
 * sin necesidad de recompilar o modificar archivos PHP.
 */
class ConfigLoader
{
    private static $configCache = [];
    private static $configPath = '';
    
    /**
     * Inicializa el ConfigLoader con la ruta de configuración
     */
    public static function init($configPath = null)
    {
        if ($configPath === null) {
            $configPath = APPPATH . 'config' . DIRECTORY_SEPARATOR;
        }
        
        self::$configPath = $configPath;
    }
    
    /**
     * Carga la configuración de base de datos desde el archivo JSON
     */
    public static function loadDatabaseConfig()
    {
        $configFile = self::$configPath . 'database-config.json';
        
        if (!file_exists($configFile)) {
            throw new \Exception("Archivo de configuración no encontrado: {$configFile}");
        }
        
        $config = self::loadConfigFile($configFile);
        
        if (!isset($config['database'])) {
            throw new \Exception("Configuración de base de datos no encontrada en el archivo");
        }
        
        return $config['database'];
    }
    
    /**
     * Carga la configuración de entorno desde el archivo JSON
     */
    public static function loadEnvironmentConfig()
    {
        $configFile = self::$configPath . 'database-config.json';
        
        if (!file_exists($configFile)) {
            return [];
        }
        
        $config = self::loadConfigFile($configFile);
        
        return $config['environment'] ?? [];
    }
    
    /**
     * Carga la configuración de seguridad desde el archivo JSON
     */
    public static function loadSecurityConfig()
    {
        $configFile = self::$configPath . 'database-config.json';
        
        if (!file_exists($configFile)) {
            return [];
        }
        
        $config = self::loadConfigFile($configFile);
        
        return $config['security'] ?? [];
    }
    
    /**
     * Carga un archivo de configuración JSON
     */
    private static function loadConfigFile($filePath)
    {
        // Verificar si ya está en caché
        if (isset(self::$configCache[$filePath])) {
            return self::$configCache[$filePath];
        }
        
        $content = file_get_contents($filePath);
        if ($content === false) {
            throw new \Exception("No se pudo leer el archivo de configuración: {$filePath}");
        }
        
        $config = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception("Error al decodificar JSON: " . json_last_error_msg());
        }
        
        // Guardar en caché
        self::$configCache[$filePath] = $config;
        
        return $config;
    }
    
    /**
     * Limpia la caché de configuración
     */
    public static function clearCache()
    {
        self::$configCache = [];
    }
    
    /**
     * Verifica si el archivo de configuración existe y es válido
     */
    public static function validateConfigFile($configFile = null)
    {
        if ($configFile === null) {
            $configFile = self::$configPath . 'database-config.json';
        }
        
        if (!file_exists($configFile)) {
            return false;
        }
        
        try {
            $content = file_get_contents($configFile);
            json_decode($content, true);
            return json_last_error() === JSON_ERROR_NONE;
        } catch (\Exception $e) {
            return false;
        }
    }
}
