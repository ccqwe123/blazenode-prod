export interface Miner {
    id: number;
    node_id: string;
    name: string;
    earned_points: string;
    level: number;
    ip_address: string;
    is_active: boolean;
    is_mining: boolean;
    mining_started_at?: string;
    last_updated_at?: string;
    mining_ends_at?: string;
}
