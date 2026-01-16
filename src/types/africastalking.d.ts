declare module 'africastalking' {
    interface ATCredentials {
        apiKey: string;
        username: string;
    }

    interface SMSOptions {
        to: string | string[];
        message: string;
        from?: string;
        enqueue?: boolean;
    }

    interface Recipient {
        number: string;
        status: string;
        cost: string;
        messageId: string;
        statusCode: number;
    }

    interface SMSMessageData {
        Message: string;
        Recipients: Recipient[];
    }

    interface SMSResponse {
        SMSMessageData: SMSMessageData;
    }

    interface SMS {
        send(options: SMSOptions): Promise<SMSResponse>;
        sendPremium(options: any): Promise<any>;
        fetchMessages(options?: any): Promise<any>;
        fetchSubscriptions(options?: any): Promise<any>;
        createSubscription(options: any): Promise<any>;
        deleteSubscription(options: any): Promise<any>;
    }

    interface USSD {
        (options: any): void;
    }

    interface AfricasTalkingInstance {
        SMS: SMS;
        USSD: USSD;
        VOICE: any;
        AIRTIME: any;
        PAYMENTS: any;
        APPLICATION: any;
    }

    function AfricasTalking(credentials: ATCredentials): AfricasTalkingInstance;

    export = AfricasTalking;
}
