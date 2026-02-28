-- ============================================================================
-- MIGRACIÓN 027: Agregar Foreign Keys de IdLastUserUpdate hacia user
-- ============================================================================
-- Descripción: Agrega foreign keys de IdLastUserUpdate hacia user.Id 
--              en todas las tablas que tienen esta columna
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

-- Deshabilitar verificaciones de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Agregar foreign keys a todas las tablas con IdLastUserUpdate
-- ============================================================================

ALTER TABLE `activity_log`
  ADD CONSTRAINT `FK_activity_log_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `agency`
  ADD CONSTRAINT `FK_agency_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `agency_user`
  ADD CONSTRAINT `FK_agency_user_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `client`
  ADD CONSTRAINT `FK_client_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `client_total_relation`
  ADD CONSTRAINT `FK_client_total_relation_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `company`
  ADD CONSTRAINT `FK_company_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `configuration_process`
  ADD CONSTRAINT `FK_configuration_process_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `configuration_process_document_type`
  ADD CONSTRAINT `FK_configuration_process_document_type_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `customer_type`
  ADD CONSTRAINT `FK_customer_type_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `document_by_file`
  ADD CONSTRAINT `FK_document_by_file_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `document_file_error`
  ADD CONSTRAINT `FK_document_file_error_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `document_file_status`
  ADD CONSTRAINT `FK_document_file_status_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `document_type`
  ADD CONSTRAINT `FK_document_type_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file`
  ADD CONSTRAINT `FK_file_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_extraordinary_reasons`
  ADD CONSTRAINT `FK_file_extraordinary_reasons_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_pld`
  ADD CONSTRAINT `FK_file_pld_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_pld_beneficial_owner`
  ADD CONSTRAINT `FK_file_pld_beneficial_owner_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_pld_geo_log`
  ADD CONSTRAINT `FK_file_pld_geo_log_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_reasons`
  ADD CONSTRAINT `FK_file_reasons_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_share_token`
  ADD CONSTRAINT `FK_file_share_token_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_status`
  ADD CONSTRAINT `FK_file_status_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `file_sub_status`
  ADD CONSTRAINT `FK_file_sub_status_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `files_to_correct`
  ADD CONSTRAINT `FK_files_to_correct_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `header_client`
  ADD CONSTRAINT `FK_header_client_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `operation_type`
  ADD CONSTRAINT `FK_operation_type_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_by_car`
  ADD CONSTRAINT `FK_order_by_car_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `process`
  ADD CONSTRAINT `FK_process_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `process_user`
  ADD CONSTRAINT `FK_process_user_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user`
  ADD CONSTRAINT `FK_user_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user_activity_logs`
  ADD CONSTRAINT `FK_user_activity_logs_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user_refresh_token`
  ADD CONSTRAINT `FK_user_refresh_token_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user_role`
  ADD CONSTRAINT `FK_user_role_IdLastUserUpdate`
  FOREIGN KEY (`IdLastUserUpdate`) REFERENCES `user` (`Id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Rehabilitar verificaciones de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migración 027 completada: Foreign keys de IdLastUserUpdate agregadas' AS status;
