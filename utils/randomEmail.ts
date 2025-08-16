

export function generateRandomEmail(baseEmail: string) : string {
    const timestamp = Date.now(); 
    const [ localPart, domain ] = baseEmail.split('@');
    return `${localPart}${timestamp}@${domain}`;
}