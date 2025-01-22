<?php

declare(strict_types=1);

namespace App\Enums;

enum ConversationTypeEnum: string
{
    case PRIVATE = 'private';
    case GROUP   = 'group';
}
