export interface Message {
    text: string;
    isGpt: boolean;
    audioUrl?: string;
    imageInfo?: {
        url: string;
        alt: string;
    };
}