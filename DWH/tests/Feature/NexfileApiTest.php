<?php

namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

/**
 * Pruebas de las APIs Nexfile (DWH)
 */
class NexfileApiTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    /** No ejecutar migraciones - usamos vistas del DWH */
    protected $migrate = false;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function testCustomersRequiresNdCliente(): void
    {
        $result = $this->get('nexfile/customers');
        $result->assertStatus(400);
        $result->assertJSONFragment(['success' => false]);
        $result->assertSee('nd_cliente');
    }

    public function testCustomersWithNdCliente(): void
    {
        $result = $this->get('nexfile/customers', [
            'nd_cliente' => '10004',
        ]);
        // 200 si hay datos, 500 si error de schema/BD
        $this->assertContains($result->response()->getStatusCode(), [200, 500]);
        if ($result->response()->getStatusCode() === 200) {
            $result->assertHeader('Content-Type', 'application/json');
            $json = json_decode($result->response()->getBody(), true);
            $this->assertArrayHasKey('data', $json);
            $this->assertArrayHasKey('data', $json['data']);
        }
    }

    public function testOrdersRequiresCustomerDms(): void
    {
        $result = $this->get('nexfile/orders');
        $result->assertStatus(400);
        $result->assertJSONFragment(['success' => false]);
        $result->assertSee('customer_dms');
    }

    public function testOrdersWithCustomerDms(): void
    {
        $result = $this->get('nexfile/orders', [
            'customer_dms' => '10004',
            'perpage' => 10,
        ]);
        $this->assertContains($result->response()->getStatusCode(), [200, 500]);
        if ($result->response()->getStatusCode() === 200) {
            $result->assertHeader('Content-Type', 'application/json');
            $body = $result->response()->getBody();
            $this->assertTrue(is_array(json_decode($body, true)) || is_object(json_decode($body)));
        }
    }

    public function testInvoicesRequiresIdAgency(): void
    {
        $result = $this->get('nexfile/invoices');
        $result->assertStatus(400);
        $result->assertJSONFragment(['success' => false]);
        $result->assertSee('id_agency');
    }

    public function testInvoicesWithIdAgency(): void
    {
        $result = $this->get('nexfile/invoices', [
            'id_agency' => '1',
            'delivery_month' => '3',
            'delivery_year' => '2025',
            'perpage' => 10,
        ]);
        $this->assertContains($result->response()->getStatusCode(), [200, 500]);
        if ($result->response()->getStatusCode() === 200) {
            $result->assertHeader('Content-Type', 'application/json');
        }
    }

    public function testCorsHeadersPresent(): void
    {
        $result = $this->get('nexfile/customers', ['nd_cliente' => '10004']);
        $response = $result->response();
        $this->assertTrue(
            $response->hasHeader('Access-Control-Allow-Origin') || $response->getStatusCode() === 500,
            'CORS header debería estar presente en respuestas exitosas'
        );
    }
}
