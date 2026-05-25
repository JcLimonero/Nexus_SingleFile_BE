<?php

namespace Tests\Unit\Traits;

use App\Traits\SnakeKeys;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * @internal
 */
final class SnakeKeysTest extends CIUnitTestCase
{
    private object $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->subject = new class () {
            use SnakeKeys {
                snakeKeys as public;
            }
        };
    }

    public function testConvertsCamelCaseKeys(): void
    {
        $out = $this->subject->snakeKeys([
            'fileId' => 1,
            'numeroPedido' => 'A',
            'fechaRegistro' => '2025-01-01',
        ]);

        $this->assertSame(['file_id' => 1, 'numero_pedido' => 'A', 'fecha_registro' => '2025-01-01'], $out);
    }

    public function testConvertsPascalCaseKeys(): void
    {
        $out = $this->subject->snakeKeys([
            'IdFile' => 5,
            'Name' => 'X',
        ]);

        $this->assertSame(['id_file' => 5, 'name' => 'X'], $out);
    }

    public function testHandlesAcronymBoundaries(): void
    {
        // IDProcess → id_process (acronym + lowercase boundary)
        $out = $this->subject->snakeKeys(['IDProcess' => 7]);
        $this->assertSame(['id_process' => 7], $out);
    }

    public function testAllCapsBecomesLowercase(): void
    {
        $out = $this->subject->snakeKeys([
            'RFC' => 'XYZ',
            'CURP' => 'ABC',
            'API_KEY' => 'k',
        ]);

        $this->assertSame(['rfc' => 'XYZ', 'curp' => 'ABC', 'api_key' => 'k'], $out);
    }

    public function testLeavesSnakeCaseUnchanged(): void
    {
        $in = ['client_type' => 'A', 'id_user_rol' => 7, 'fecha_registro' => '2025-01-01'];
        $this->assertSame($in, $this->subject->snakeKeys($in));
    }

    public function testRecursesIntoNestedArrays(): void
    {
        $out = $this->subject->snakeKeys([
            'data' => [
                'MaxDate' => '2025-01-01',
                'subList' => [
                    ['IdFile' => 1, 'numeroPedido' => 'a'],
                    ['IdFile' => 2, 'numeroPedido' => 'b'],
                ],
            ],
        ]);

        $this->assertSame([
            'data' => [
                'max_date' => '2025-01-01',
                'sub_list' => [
                    ['id_file' => 1, 'numero_pedido' => 'a'],
                    ['id_file' => 2, 'numero_pedido' => 'b'],
                ],
            ],
        ], $out);
    }

    public function testConvertsObjectsToArrays(): void
    {
        $obj = (object) ['fileId' => 42, 'numeroPedido' => 'X'];
        $out = $this->subject->snakeKeys($obj);

        $this->assertSame(['file_id' => 42, 'numero_pedido' => 'X'], $out);
    }

    public function testPreservesNumericKeys(): void
    {
        $out = $this->subject->snakeKeys([0 => 'a', 1 => 'b', 'fooBar' => 'c']);
        $this->assertSame([0 => 'a', 1 => 'b', 'foo_bar' => 'c'], $out);
    }

    public function testPreservesScalarValues(): void
    {
        // Values are NOT transformed; only keys.
        $out = $this->subject->snakeKeys([
            'descriptionField' => 'Some VALUE With Spaces and CamelText',
            'count' => 42,
            'flag' => true,
            'maybeNull' => null,
        ]);

        $this->assertSame([
            'description_field' => 'Some VALUE With Spaces and CamelText',
            'count' => 42,
            'flag' => true,
            'maybe_null' => null,
        ], $out);
    }
}
