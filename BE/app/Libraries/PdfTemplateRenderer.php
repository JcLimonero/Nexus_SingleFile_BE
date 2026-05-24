<?php

namespace App\Libraries;

use Mpdf\Mpdf;
use Mpdf\Output\Destination;
use RuntimeException;

/**
 * Local PDF renderer that consumes templates exported from PDF Generator API
 * (JSON layout + per-page background images). Eliminates the paid third-party
 * service. Backgrounds and lean template JSON live under BE/assets/pdf-templates/<name>/.
 */
class PdfTemplateRenderer
{
    private string $templatesPath;

    private const FONT_MAP = [
        'opensans'  => 'dejavusans',
        'open sans' => 'dejavusans',
        'arial'     => 'dejavusans',
        'helvetica' => 'dejavusans',
        'sans'      => 'dejavusans',
        'times'     => 'dejavuserif',
        'serif'     => 'dejavuserif',
        'courier'   => 'dejavusansmono',
        'mono'      => 'dejavusansmono',
    ];

    private const VALIGN_MAP = ['top' => 'T', 'middle' => 'M', 'bottom' => 'B'];

    public function __construct(?string $templatesPath = null)
    {
        $this->templatesPath = $templatesPath ?? rtrim(FCPATH, '/\\') . '/../assets/pdf-templates';
    }

    public function render(string $templateName, array $data): string
    {
        $dir = $this->templatesPath . '/' . $templateName;
        $manifestPath = $dir . '/template.json';
        if (!is_file($manifestPath)) {
            throw new RuntimeException("Template not found: {$manifestPath}");
        }

        $template = json_decode(file_get_contents($manifestPath), true);
        if (!is_array($template) || empty($template['pages'])) {
            throw new RuntimeException("Invalid template manifest: {$manifestPath}");
        }

        $layout = $template['layout'] ?? [];
        $widthCm  = (float) ($layout['width']  ?? 21);
        $heightCm = (float) ($layout['height'] ?? 29.7);
        $orientation = (($layout['orientation'] ?? 'portrait') === 'landscape') ? 'L' : 'P';

        $tempDir = WRITEPATH . 'cache/mpdf';
        if (!is_dir($tempDir)) {
            @mkdir($tempDir, 0775, true);
        }

        $mpdf = new Mpdf([
            'format'         => [$widthCm * 10, $heightCm * 10],
            'orientation'    => $orientation,
            'margin_left'    => 0,
            'margin_right'   => 0,
            'margin_top'     => 0,
            'margin_bottom'  => 0,
            'margin_header'  => 0,
            'margin_footer'  => 0,
            'default_font'   => 'dejavusans',
            'tempDir'        => $tempDir,
        ]);

        foreach ($template['pages'] as $i => $page) {
            if ($i > 0) {
                $mpdf->AddPage();
            }

            $bgRel = $page['backgroundImagePath'] ?? null;
            if ($bgRel) {
                $bgPath = $dir . '/' . $bgRel;
                if (is_file($bgPath)) {
                    $mpdf->Image($bgPath, 0, 0, $widthCm * 10, $heightCm * 10, '', '', true, false);
                }
            }

            foreach ($page['components'] ?? [] as $component) {
                $this->renderComponent($mpdf, $component, $data);
            }
        }

        return $mpdf->Output('', Destination::STRING_RETURN);
    }

    private function renderComponent(Mpdf $mpdf, array $c, array $data): void
    {
        $value = $this->interpolate((string) ($c['value'] ?? ''), $data);
        if ($value === '') {
            return;
        }

        $x = (float) ($c['left']   ?? 0) * 10;
        $y = (float) ($c['top']    ?? 0) * 10;
        $w = (float) ($c['width']  ?? 0) * 10;
        $h = (float) ($c['height'] ?? 0) * 10;
        if ($w <= 0 || $h <= 0) {
            return;
        }

        $fontFamily = self::FONT_MAP[strtolower($c['fontFamily'] ?? 'opensans')] ?? 'dejavusans';
        $fontSize   = (float) ($c['fontSize'] ?? 10);
        $fontType   = (array) ($c['fontType'] ?? []);
        $style = '';
        if (in_array('bold', $fontType, true))      $style .= 'B';
        if (in_array('italic', $fontType, true))    $style .= 'I';
        if (in_array('underline', $fontType, true)) $style .= 'U';

        $align = $this->alignChar($c['fontAlign'] ?? 'left');
        $valign = self::VALIGN_MAP[strtolower($c['fontValign'] ?? 'middle')] ?? 'M';

        [$r, $g, $b] = $this->hexToRgb($c['fontColor'] ?? '#000000');

        $fittedSize = $this->fitFontSize($mpdf, $value, $w, $fontSize, $fontFamily, $style, !empty($c['dynamicFontSize']));

        $mpdf->SetFont($fontFamily, $style, $fittedSize);
        $mpdf->SetTextColor($r, $g, $b);
        $mpdf->SetXY($x, $y);

        $mpdf->Cell(
            $w,
            $h,
            $value,
            0,
            0,
            $align,
            false,
            '',
            0,
            0,
            0,
            $valign
        );
    }

    private function interpolate(string $template, array $data): string
    {
        if (strpos($template, '{') === false) {
            return $template;
        }
        return preg_replace_callback('/\{([a-zA-Z0-9_]+)\}/', function ($m) use ($data) {
            return (string) ($data[$m[1]] ?? '');
        }, $template);
    }

    private function alignChar(string $align): string
    {
        $a = strtolower($align);
        if ($a === 'center')  return 'C';
        if ($a === 'right')   return 'R';
        if ($a === 'justify') return 'J';
        return 'L';
    }

    private function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        if (strlen($hex) !== 6) {
            return [0, 0, 0];
        }
        return [hexdec(substr($hex, 0, 2)), hexdec(substr($hex, 2, 2)), hexdec(substr($hex, 4, 2))];
    }

    /**
     * Shrink the font until the text fits within $maxWidth (mm). Only kicks in
     * when the template marks the component as dynamicFontSize.
     */
    private function fitFontSize(Mpdf $mpdf, string $text, float $maxWidth, float $baseSize, string $family, string $style, bool $enabled): float
    {
        if (!$enabled || $maxWidth <= 0) {
            return $baseSize;
        }
        $mpdf->SetFont($family, $style, $baseSize);
        $size = $baseSize;
        $textWidth = $mpdf->GetStringWidth($text);
        while ($textWidth > $maxWidth && $size > 5.0) {
            $size -= 0.5;
            $mpdf->SetFont($family, $style, $size);
            $textWidth = $mpdf->GetStringWidth($text);
        }
        return $size;
    }
}
