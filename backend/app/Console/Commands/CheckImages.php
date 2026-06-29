<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-images';
    protected $description = 'Command description';

    public function handle()
    {
        $packages = \App\Models\ServicePackage::select('title', 'image_360_url')->get();
        foreach ($packages as $p) {
            $this->info($p->title . ' -> ' . $p->image_360_url);
        }
    }
}
