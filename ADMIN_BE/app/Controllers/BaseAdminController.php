<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;

abstract class BaseAdminController extends Controller
{
    /** @var CLIRequest|IncomingRequest */
    protected $request;

    /** @var list<string> */
    protected $helpers = [];

    protected function getSuperAdmin(): ?array
    {
        return $_REQUEST['_super_admin'] ?? null;
    }
}
