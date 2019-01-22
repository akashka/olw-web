import { InjectionToken } from '@angular/core';
var socialLinks = [];
export var defaultAuthOptions = {
    strategies: [],
    forms: {
        login: {
            redirectDelay: 500,
            strategy: 'email',
            rememberMe: true,
            showMessages: {
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        register: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            terms: true,
            socialLinks: socialLinks,
        },
        requestPassword: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        resetPassword: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        logout: {
            redirectDelay: 500,
            strategy: 'email',
        },
        validation: {
            password: {
                required: true,
                minLength: 4,
                maxLength: 50,
            },
            email: {
                required: true,
            },
            fullName: {
                required: false,
                minLength: 4,
                maxLength: 50,
            },
        },
    },
};
export var AUTH_OPTIONS = new InjectionToken('Nebular Auth Options');
export var AUTH_USER_OPTIONS = new InjectionToken('Nebular User Auth Options');
export var AUTH_STRATEGIES = new InjectionToken('Nebular Auth Strategies');
export var AUTH_TOKENS = new InjectionToken('Nebular Auth Tokens');
export var AUTH_INTERCEPTOR_HEADER = new InjectionToken('Nebular Simple Interceptor Header');
export var AUTH_TOKEN_INTERCEPTOR_FILTER = new InjectionToken('Nebular Interceptor Filter');
//# sourceMappingURL=auth.options.js.map