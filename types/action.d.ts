interface ActionResponse<T = null>  {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>
    };
    status?: number;
}

interface AuthCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
}