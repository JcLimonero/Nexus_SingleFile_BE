-- ============================================================================
-- MIGRACIÓN 056: Agregar payment_date a liquidation_receipt_detail
-- ============================================================================
-- payment_date = fecha real del pago (cuándo se realizó realmente) - para PLD
-- registration_date = fecha de carga en el sistema (auditoría)
-- ============================================================================

ALTER TABLE `liquidation_receipt_detail`
  ADD COLUMN `payment_date` DATE NULL DEFAULT NULL
  AFTER `id_payment_method`;
