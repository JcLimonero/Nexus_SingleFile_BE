<?php

namespace Tests\Feature\Phase;

use Tests\Support\FeatureApiTestCase;

final class PhaseControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/phase';

    public function testActiveForUserRequiresAuth(): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . '/active-for-user');
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testActiveForUserReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active-for-user');
        $this->assertJsonShape($resp, "GET /active-for-user");
    }
}
