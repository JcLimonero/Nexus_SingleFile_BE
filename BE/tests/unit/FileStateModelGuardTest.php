<?php

namespace Tests\Unit;

use App\Models\FileStateModel;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * Valida los callbacks beforeUpdate/beforeDelete de FileStateModel que
 * protegen las fases base (is_system=1 → Integración y Liquidación) contra
 * cualquier cambio vía Model API.
 *
 * Estos tests usan el DB live de test8 (no fixtures aisladas), así que
 * un fallo del guard NO modificaría data porque la excepción detiene
 * la transacción antes del UPDATE/DELETE.
 */
final class FileStateModelGuardTest extends CIUnitTestCase
{
    protected $DBGroup = 'default';

    private FileStateModel $model;

    protected function setUp(): void
    {
        parent::setUp();
        $this->model = new FileStateModel();
    }

    // ===== Sanity: is_system está bien backfilled =====

    public function testIntegracionIsSystem(): void
    {
        $this->assertTrue($this->model->isSystemPhase(1),
            'Integración (id=1) debe ser is_system=1');
    }

    public function testLiquidacionIsSystem(): void
    {
        $this->assertTrue($this->model->isSystemPhase(2),
            'Liquidación (id=2) debe ser is_system=1');
    }

    public function testLiberacionIsNotSystem(): void
    {
        $this->assertFalse($this->model->isSystemPhase(3),
            'Liberación (id=3) NO debe ser is_system');
    }

    public function testTerminalStatesAreNotSystem(): void
    {
        // Liberado, Cancelado, Excepción son terminales pero no system —
        // el admin puede removerlos si cambia el flujo.
        $this->assertFalse($this->model->isSystemPhase(4));
        $this->assertFalse($this->model->isSystemPhase(5));
        $this->assertFalse($this->model->isSystemPhase(6));
    }

    // ===== Guards =====

    public function testUpdateRejectsSystemPhaseRename(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/Integraci[\x{00f3}o]n.*sistema/u');
        $this->model->update(1, ['name' => 'No deberías poder']);
    }

    public function testUpdateRejectsSystemPhaseDisable(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/Liquidaci[\x{00f3}o]n.*sistema/u');
        $this->model->update(2, ['enabled' => 0]);
    }

    public function testDeleteRejectsSystemPhase(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/sistema/');
        $this->model->delete(1);
    }

    public function testUpdateAllowsNonSystemPhase(): void
    {
        // Sanity inverso: una fase no-system debe permitir update.
        // Usamos id=3 (Liberación) y un cambio idempotente (escribe el mismo
        // name) para no modificar realmente nada en test8.
        $row = $this->model->find(3);
        $this->assertNotNull($row, 'Liberación (id=3) debe existir en test8');

        // Update con el mismo nombre — no falla el guard.
        $result = $this->model->update(3, ['name' => $row['name']]);
        $this->assertNotFalse($result, 'Update sobre fase no-system debe pasar');
    }
}
