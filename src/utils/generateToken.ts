export default function generateToken(): string {
    const random = (): string => Math.random().toString(36).substr(2);
    return random() + random();
}