import {AbstractControl, ValidationErrors} from '@angular/forms';

const TELEGRAM_BOT_TOKEN_PATTERN = /^\d{8,10}:[A-Za-z0-9_-]{35}$/;

export function telegramBotToken(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (value === null || value === undefined || value === '') return null;
	return TELEGRAM_BOT_TOKEN_PATTERN.test(value) ? null : {orchardTelegramBotToken: true};
}
