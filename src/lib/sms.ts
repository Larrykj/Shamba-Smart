import AfricasTalking from 'africastalking';

// Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: process.env.AT_API_KEY || '',
    username: process.env.AT_USERNAME || 'sandbox',
});

const sms = africastalking.SMS;

interface SendSMSOptions {
    to: string | string[];
    message: string;
    from?: string; // Optional sender ID (requires approval from AT)
}

interface SMSResponse {
    success: boolean;
    messageId?: string;
    cost?: string;
    error?: string;
}

/**
 * Send SMS to one or more recipients
 */
export async function sendSMS({ to, message, from }: SendSMSOptions): Promise<SMSResponse> {
    try {
        // Ensure numbers are in international format
        const recipients = Array.isArray(to) ? to : [to];
        const formattedNumbers = recipients.map(formatPhoneNumber);

        const options: any = {
            to: formattedNumbers,
            message,
        };

        // Add sender ID if provided (requires AT approval)
        if (from) {
            options.from = from;
        }

        const result = await sms.send(options);

        console.log('SMS sent:', result);

        // Check if any message was sent successfully
        const successfulMessages = result.SMSMessageData?.Recipients?.filter(
            (r: any) => r.status === 'Success'
        );

        if (successfulMessages && successfulMessages.length > 0) {
            return {
                success: true,
                messageId: successfulMessages[0].messageId,
                cost: result.SMSMessageData?.Message,
            };
        }

        return {
            success: false,
            error: result.SMSMessageData?.Message || 'Failed to send SMS',
        };
    } catch (error: any) {
        console.error('SMS Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to send SMS',
        };
    }
}

/**
 * Send weather alert SMS
 */
export async function sendWeatherAlert(
    phone: string,
    location: string,
    alert: string
): Promise<SMSResponse> {
    const message = `🌾 SHAMBA SMART ALERT\n\n📍 ${location}\n\n${alert}\n\nDial *384*1300# for more info.`;
    return sendSMS({ to: phone, message });
}

/**
 * Send market price alert SMS
 */
export async function sendPriceAlert(
    phone: string,
    market: string,
    prices: { crop: string; price: number; change: number }[]
): Promise<SMSResponse> {
    let priceText = prices
        .map(p => `${p.crop}: KES ${p.price.toLocaleString()} (${p.change > 0 ? '+' : ''}${p.change}%)`)
        .join('\n');

    const message = `📊 SHAMBA SMART PRICES\n\n📍 ${market} Market\n\n${priceText}\n\nDial *384*1300# for details.`;
    return sendSMS({ to: phone, message });
}

/**
 * Send planting recommendation SMS
 */
export async function sendPlantingAdvice(
    phone: string,
    crop: string,
    recommendation: string,
    confidence: number
): Promise<SMSResponse> {
    const message = `🌱 SHAMBA SMART\n\n${crop} Planting Advice:\n\n${recommendation}\n\nConfidence: ${confidence}%\n\nDial *384*1300# for full report.`;
    return sendSMS({ to: phone, message });
}

/**
 * Format phone number to international format
 */
function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Handle Kenyan numbers
    if (cleaned.startsWith('0')) {
        cleaned = '+254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
        cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+')) {
        cleaned = '+254' + cleaned;
    }

    return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidKenyanNumber(phone: string): boolean {
    const formatted = formatPhoneNumber(phone);
    // Kenyan numbers: +254 7XX XXX XXX or +254 1XX XXX XXX
    return /^\+254[17]\d{8}$/.test(formatted);
}
