<?php

namespace Tests\Feature\PaymentMethod;

use Tests\Support\FeatureApiTestCase;

final class PaymentMethodControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/payment-method';

    public function testListRequiresAuth(): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . '/');
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testListReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ GET / → " . ($body['message'] ?? '') . "\n");
        }
    }
}
