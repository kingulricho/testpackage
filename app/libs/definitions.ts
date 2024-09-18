export type Payload = {
    transmission_id: string | null;
    transmission_time: string | null;
    cert_url: string | null;
    auth_algo: string | null;
    transmission_sig: string | null;
    webhook_id: string;
    webhook_event: any;
}