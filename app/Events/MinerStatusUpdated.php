<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Miner;

class MinerStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Miner $miner) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('miners.' . $this->miner->user_id),
        ];
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->miner->id,
            'mining_ends_at' => optional($this->miner->mining_ends_at)->toDateTimeString(),
            'is_mining' => $this->miner->is_mining,
        ];
    }
}
