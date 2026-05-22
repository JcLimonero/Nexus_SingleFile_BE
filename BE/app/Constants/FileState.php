<?php

namespace App\Constants;

final class FileState
{
    public const INTEGRATION         = 1;
    public const LIQUIDATION         = 2;
    public const RELEASE             = 3;
    public const RELEASED            = 4;
    public const CANCELED            = 5;
    public const RELEASED_EXCEPTION  = 6;

    public const DELIVERED_STATES  = [self::RELEASED, self::RELEASED_EXCEPTION];
    public const IN_PROCESS_STATES = [self::INTEGRATION, self::LIQUIDATION, self::RELEASE];
    public const CANCELED_STATES   = [self::CANCELED];
}
