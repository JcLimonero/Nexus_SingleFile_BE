<?php

/**
 * Script para verificar y corregir nombres de tablas en el código
 * 
 * Este script identifica todas las referencias a nombres de tablas y las corrige
 * para que sean consistentes con los nombres reales en la base de datos.
 */

// Mapeo de nombres de tablas: PascalCase/MixedCase -> snake_case
$tableNameMapping = [
    // Tablas principales
    'DocumentType' => 'document_type',
    'documentType' => 'document_type',
    'FileStatus' => 'file_status',
    'fileStatus' => 'file_status',
    'FileSubStatus' => 'file_sub_status',
    'FileSubstatus' => 'file_sub_status',
    'fileSubStatus' => 'file_sub_status',
    'DocumentFileStatus' => 'document_file_status',
    'documentFileStatus' => 'document_file_status',
    'DocumentFile_Error' => 'document_file_error',
    'DocumentFile_Status' => 'document_file_status',
    'documentFileError' => 'document_file_error',
    'documentFileStatus' => 'document_file_status',
    
    // Tablas de configuración
    'ConfigurationProcess' => 'configuration_process',
    'configurationProcess' => 'configuration_process',
    'ConfigurationProcessDocumentType' => 'configuration_process_document_type',
    'ConfigurationProcess_DocumentType' => 'configuration_process_document_type',
    'configurationProcessDocumentType' => 'configuration_process_document_type',
    'configuration_processDocumentType' => 'configuration_process_document_type',
    
    // Tablas de relaciones
    'AgencyUser' => 'agency_user',
    'agencyUser' => 'agency_user',
    'ProcessUser' => 'process_user',
    'processUser' => 'process_user',
    
    // Tablas de archivos
    'FileReasons' => 'file_reasons',
    'fileReasons' => 'file_reasons',
    'File_Reasons' => 'file_reasons',
    'FileExtraordinaryReasons' => 'file_extraordinary_reasons',
    'File_Extraordinary_Reasons' => 'file_extraordinary_reasons',
    'fileExtraordinaryReasons' => 'file_extraordinary_reasons',
    'FileShareToken' => 'file_share_token',
    'fileShareToken' => 'file_share_token',
    'File_ShareToken' => 'file_share_token',
    
    // Tablas de cliente
    'ClientTotalRelation' => 'client_total_relation',
    'clientTotalRelation' => 'client_total_relation',
    'Client_Total_Relation' => 'client_total_relation',
    'HeaderClient' => 'header_client',
    'headerClient' => 'header_client',
    'client_header' => 'header_client', // Verificar cuál es el correcto
    'client_dms_relation' => 'client_dms_relation', // Ya está correcto
    
    // Tablas de usuario
    'UserRefreshToken' => 'user_refresh_token',
    'userRefreshToken' => 'user_refresh_token',
    'User_RefreshToken' => 'user_refresh_token',
    'UserActivityLogs' => 'user_activity_logs',
    'userActivityLogs' => 'user_activity_logs',
    'User_Activity_Logs' => 'user_activity_logs',
    'UserRol' => 'user_role',
    'userRol' => 'user_role',
    'user_role' => 'user_role', // Ya está correcto
    
    // Tablas de documentos
    'DocumentByFile' => 'file_document', // Verificar: puede ser document_by_file o file_document
    'documentByFile' => 'file_document',
    'file_document' => 'file_document', // Ya está correcto
    
    // Tablas de PLD
    'FilePld' => 'file_pld',
    'filePld' => 'file_pld',
    'FilePldGeoLog' => 'file_pld_geo_log',
    'filePldGeoLog' => 'file_pld_geo_log',
    'file_pld_geolog' => 'file_pld_geo_log',
    'FilePldBeneficiarioFinal' => 'file_pld_beneficial_owner',
    'filePldBeneficiarioFinal' => 'file_pld_beneficial_owner',
    'file_pld_beneficiariofinal' => 'file_pld_beneficial_owner',
    
    // Tablas de proceso
    'OperationType' => 'operation_type',
    'operationType' => 'operation_type',
    'operationtype' => 'operation_type',
    
    // Tablas de expedientes
    'ExpedientesCorregir' => 'expedientes_corregir',
    'expedientesCorregir' => 'expedientes_corregir',
    'files_to_correct' => 'expedientes_corregir', // Verificar
    
    // Otras tablas
    'OrderByCar' => 'order_by_car',
    'orderByCar' => 'order_by_car',
    'orderbycar' => 'order_by_car',
];

// Nombres de tablas que ya están correctos (snake_case)
$correctTableNames = [
    'user',
    'agency',
    'process',
    'company',
    'client',
    'customer_type',
    'operation_type',
    'file_status',
    'file_sub_status',
    'file_reasons',
    'file_extraordinary_reasons',
    'file_share_token',
    'file_pld',
    'file_pld_geo_log',
    'file_pld_beneficial_owner',
    'user_activity_logs',
    'user_refresh_token',
    'user_role',
    'document_type',
    'document_file_status',
    'document_file_error',
    'file_document',
    'configuration_process',
    'configuration_process_document_type',
    'agency_user',
    'process_user',
    'client_total_relation',
    'header_client',
    'client_dms_relation',
    'order_by_car',
    'expedientes_corregir',
    'file_exception_reason', // Verificar si es file_extraordinary_reasons
];

echo "=== MAPEO DE NOMBRES DE TABLAS ===\n\n";
echo "Total de mapeos: " . count($tableNameMapping) . "\n";
echo "Total de nombres correctos: " . count($correctTableNames) . "\n\n";

echo "=== NOMBRES A CORREGIR ===\n";
foreach ($tableNameMapping as $incorrect => $correct) {
    echo "- '$incorrect' -> '$correct'\n";
}

echo "\n=== NOMBRES CORRECTOS ===\n";
foreach ($correctTableNames as $name) {
    echo "- '$name'\n";
}
