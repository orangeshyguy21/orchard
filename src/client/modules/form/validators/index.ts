import {micros} from './micros';
import {minGreaterThan} from './min-greater-than';
import {integer} from './integer';
import {cents} from './cents';
import {url} from './url';
import {openrouterKey} from './openrouter-key';
import {telegramBotToken} from './telegram-bot-token';

export class OrchardValidators {
	static micros = micros;
	static minGreaterThan = minGreaterThan;
	static integer = integer;
	static cents = cents;
	static url = url;
	static openrouterKey = openrouterKey;
	static telegramBotToken = telegramBotToken;
}
