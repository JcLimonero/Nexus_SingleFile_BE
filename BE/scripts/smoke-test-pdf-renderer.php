<?php
/**
 * Smoke test for PdfTemplateRenderer.
 *
 * Run from BE/:
 *   php scripts/smoke-test-pdf-renderer.php
 *
 * Outputs writable/cache/smoke-fisica.pdf and writable/cache/smoke-moral.pdf
 */

// Minimal CI4 bootstrap for FCPATH + WRITEPATH constants
require __DIR__ . '/../vendor/autoload.php';
define('FCPATH', __DIR__ . '/../public/');
define('WRITEPATH', __DIR__ . '/../writable/');
define('APPPATH', __DIR__ . '/../app/');
define('ROOTPATH', __DIR__ . '/../');
define('SYSTEMPATH', __DIR__ . '/../vendor/codeigniter4/framework/system/');

require_once __DIR__ . '/../app/Libraries/PdfTemplateRenderer.php';

$today = date('Y-m-d');

$fisicaData = [
    'apellido_materno_row_1' => 'PÉREZ',
    'apellido_paterno_row_1' => 'GARCÍA',
    'autoridad_que_la_emite_row_1' => 'INE',
    'c_digo_postal_row_1' => '64000',
    'c_u_r_p_row_1' => 'GAPJ850315HNLRRR04',
    'calle_avenida_o_v_a_row_1' => 'Av. Constitución',
    'ciudad_poblaci_n_o_entidad_federativa_row_1' => 'Monterrey',
    'colonia_o_urbanizaci_n_row_1' => 'Centro',
    'correo_el_ctronico_row_1' => 'juan.garcia@example.com',
    'demarcaci_n_pol_tica_o_municipio_row_1' => 'Monterrey',
    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => 'Nexus Q-Tech',
    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => 'Empleado',
    'extensi_n_en_su_caso_row_1' => '',
    'extranjero' => '',
    'fecha_de_elaboraci_n_del_formato_row_1' => $today,
    'fecha_de_nacimiento_row_1' => '1985-03-15',
    'n_mero_exterior_row_1' => '123',
    'n_mero_interior_en_su_caso_row_1' => 'A',
    'n_mero_o_folio_row_1' => 'FOLIO-001',
    'n_mero_telef_nico_con_clave_lada_row_1' => '8181234567',
    'nacional' => 'X',
    'no_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => 'X',
    'nombre_completo_y_firma_del_cliente' => 'Juan García Pérez',
    'nombre_de_la_identificaci_n_row_1' => 'INE',
    'nombre_s_sin_abreviaturas_row_1' => 'Juan',
    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => 'Carlos Limón',
    'pa_s_de_nacimiento_row_1' => 'México',
    'pa_s_de_nacionalidad_row_1' => 'México',
    'pa_s_row_1' => 'México',
    'r_f_c_row_1' => 'GAPJ850315ABC',
    's_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => '',
];

$moralData = [
    'actividad_giro_mercantil_u_objeto_social_row_1' => 'Servicios de tecnología',
    'apellido_materno_row_1' => 'PÉREZ',
    'apellido_paterno_row_1' => 'GARCÍA',
    'autoridad_que_la_emite_row_1' => 'INE',
    'c_digo_postal_row_1' => '64000',
    'c_u_r_p_row_1' => 'GAPJ850315HNLRRR04',
    'calle_avenida_o_v_a_row_1' => 'Av. Constitución',
    'ciudad_poblaci_n_o_entidad_federativa_row_1' => 'Monterrey',
    'colonia_o_urbanizaci_n_row_1' => 'Centro',
    'correo_el_ctronico_row_1' => 'contacto@empresa.com',
    'demarcaci_n_pol_tica_o_municipio_row_1' => 'Monterrey',
    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => 'Nexus Q-Tech',
    'denominaci_n_o_raz_n_social_row_1' => 'Empresa Demo S.A. de C.V.',
    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => 'Tecnología',
    'extensi_n_en_su_caso_row_1' => '101',
    'extranjero' => '',
    'fecha_de_constituci_n_row_1' => '2020-01-15',
    'fecha_de_elaboraci_n_del_formato_row_1' => $today,
    'fecha_de_nacimiento_row_1' => '1985-03-15',
    'n_mero_exterior_row_1' => '123',
    'n_mero_interior_en_su_caso_row_1' => '101',
    'n_mero_o_folio_row_1' => 'FOLIO-002',
    'n_mero_telef_nico_con_clave_lada_row_1' => '8181234567',
    'nacional' => 'X',
    'nombre_completo_y_firma_del_representante_o_apoderado_legal' => 'Juan García Pérez',
    'nombre_de_la_identificaci_n_row_1' => 'INE',
    'nombre_s_sin_abreviaturas_row_1' => 'Juan',
    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => 'Carlos Limón',
    'pa_s_de_nacimiento_row_1' => 'México',
    'pa_s_de_nacionalidad_row_1' => 'México',
    'pa_s_row_1' => 'México',
    'r_f_c_row_1' => 'EDE200115ABC',
];

$renderer = new \App\Libraries\PdfTemplateRenderer(__DIR__ . '/../assets/pdf-templates');

foreach (['fisica' => $fisicaData, 'moral' => $moralData] as $kind => $data) {
    $pdf = $renderer->render($kind, $data);
    $out = WRITEPATH . 'cache/smoke-' . $kind . '.pdf';
    if (!is_dir(dirname($out))) @mkdir(dirname($out), 0775, true);
    file_put_contents($out, $pdf);
    echo "Generated {$out} (" . number_format(strlen($pdf)) . " bytes)\n";
}
