<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('reservations:cancel-expired')->hourly();
