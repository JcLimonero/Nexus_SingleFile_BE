import { snakeFileToFile, mapFilesResponse } from './api-mappers';

describe('api-mappers', () => {
  describe('snakeFileToFile', () => {
    it('mapea snake_case del BE a aliases camelCase', () => {
      const out = snakeFileToFile({
        file_id: 42,
        numero_pedido: 'PED-001',
        numero_inventario: 'INV-7',
        tipo_cliente: 'Individual',
        fecha_registro: '2025-01-01',
        agencia: 'Sur',
        estatus: 'liberado'
      });

      expect(out.fileId).toBe(42);
      expect(out.numeroPedido).toBe('PED-001');
      expect(out.numeroInventario).toBe('INV-7');
      expect(out.tipoCliente).toBe('Individual');
      expect(out.fechaRegistro).toBe('2025-01-01');
      // Pass-through de campos ya snake/lower
      expect(out.agencia).toBe('Sur');
      expect(out.estatus).toBe('liberado');
    });

    it('acepta camelCase legacy como fallback', () => {
      const out = snakeFileToFile({
        fileId: 5,
        numeroPedido: 'X',
        tipoCliente: 'Empresarial'
      });

      expect(out.fileId).toBe(5);
      expect(out.numeroPedido).toBe('X');
      expect(out.tipoCliente).toBe('Empresarial');
    });

    it('snake_case gana sobre camelCase si ambos están presentes', () => {
      const out = snakeFileToFile({
        file_id: 'snake-wins',
        fileId: 'camel-loses'
      });

      expect(out.fileId).toBe('snake-wins');
    });

    it('retorna el valor tal cual si es null/undefined', () => {
      expect(snakeFileToFile(null)).toBeNull();
      expect(snakeFileToFile(undefined)).toBeUndefined();
    });

    it('preserva campos extra no mapeados', () => {
      const out = snakeFileToFile({
        file_id: 1,
        custom_field: 'foo',
        anotherCamel: 'bar'
      });

      expect(out.custom_field).toBe('foo');
      expect(out.anotherCamel).toBe('bar');
    });
  });

  describe('mapFilesResponse', () => {
    it('envuelve un response {data: {files: [...]}} aplicando snakeFileToFile a cada item', () => {
      const r = mapFilesResponse({
        success: true,
        data: {
          files: [
            { file_id: 1, numero_pedido: 'A' },
            { file_id: 2, numero_pedido: 'B' }
          ],
          total: 2
        }
      });

      expect(r.success).toBe(true);
      expect(r.data.total).toBe(2);
      expect(r.data.files[0].fileId).toBe(1);
      expect(r.data.files[1].numeroPedido).toBe('B');
    });

    it('regresa el response sin cambios si no hay data.files', () => {
      const r = mapFilesResponse({ success: false, message: 'oops' });
      expect(r).toEqual({ success: false, message: 'oops' });
    });

    it('no rompe si data.files no es array', () => {
      const r = mapFilesResponse({ success: true, data: { files: 'not-an-array' } });
      expect(r.data.files).toBe('not-an-array');
    });
  });
});
