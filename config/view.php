<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Paths
    |--------------------------------------------------------------------------
    |
    | Here you may specify which view paths should be checked when rendering
    | your application views. By default, Laravel will only check the views
    | directory inside the resources path.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled Views Path
    |--------------------------------------------------------------------------
    |
    | In serverless environments like Vercel, the application filesystem is
    | read-only except for the system temp directory. Point compiled Blade
    | views there so Laravel can safely compile exception and page views.
    |
    */

    'compiled' => env('VERCEL') ? sys_get_temp_dir() : env('VIEW_COMPILED_PATH', sys_get_temp_dir()),

];
