<?php

namespace Config;

/**
 * Nombres de columnas homologados a snake_case en el DWH.
 */
class DwhColumns extends \CodeIgniter\Config\BaseConfig
{
    public string $clientConnection = 'connection_string';
    public string $clientNdCliente = 'nd_cliente';
    public string $ordersCustomerDms = 'customer_dms';
    public string $ordersConnection = 'connection_string';
    public string $invoicesIdAgency = 'id_agency';
    public string $invoicesDeliveryMonth = 'delivery_month';
    public string $invoicesDeliveryYear = 'delivery_year';
}
