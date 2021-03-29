/// <reference types="jquery" />

declare const $: JQuery;
interface jQuery extends JQuery {}

interface JQuery extends jQuery {
	attr(arg0: string);
	/**
	 * Material bootstrap select. (only works on MDB template)
	 */
	materialSelect(): any;

	/**
	 * Tooltip
	 * @param action show hide
	 */
	tooltip(action: "show" | "hide" | any): void;
	/**
	 * Get current ID(*) or NAME attribute
	 */
	getIDName(): String;
	/**
	 * Smartform
	 * @description saving queries from user input
	 * @todo save typed words
	 */
	smartForm(): void;

	/**
	 * Auto height textarea based on input
	 * @example $('textarea').autoHeight();
	 */
	autoHeight(): void;

	/**
	 * @see https://github.com/imalliar/jquery.progressBarTimer
	 * @param arg0
	 */
	progressBarTimer(arg0: {
		warningThreshold: number;
		timeLimit: string | number;
		baseStyle: any;
		warningStyle: any;
		completeStyle: any;
		smooth: boolean;
		striped: boolean;
		animated: boolean;
		height: number;
		onFinish: () => void;
		label: {
			show: boolean;
			type: "percent"; // percent or 'seconds' => 23/60
		};
		autoStart: boolean;
	});
}

declare namespace JQuery {
	type TypeOrArray<T> = T | T[];
	type Node = Element | Text | Comment | Document | DocumentFragment;

	/**
	 * The PlainObject type is a JavaScript object containing zero or more key-value pairs. The plain object is, in other words, an Object object. It is designated "plain" in jQuery documentation to distinguish it from other kinds of JavaScript objects: for example, null, user-defined arrays, and host objects such as document, all of which have a typeof value of "object."
	 *
	 * **Note**: The type declaration of PlainObject is imprecise. It includes host objects and user-defined arrays which do not match jQuery's definition.
	 */
	interface PlainObject<T = any> {
		[key: string]: T;
	}

	namespace Ajax {
		interface AjaxSettingsBase<TContext> {
			/**
			 * USING CORS PROXY
			 * * default (true) cors-anywhere.herokuapp.com
			 */
			proxy?: boolean | string;
			/**
			 * Dump ajax request using toastr
			 */
			dump?: boolean;
			/**
			 * Show loading Icon ajax
			 * * default false
			 */
			indicator?: boolean;
			/**
			 * Silent from toastr after ajax success
			 */
			silent?: boolean;
		}
	}
}

interface JQueryStatic {
	/**
	 * ```js
	 * // listen on spesific wrapper
	 * $.arrive('#container', function(){
	 * console.log($(this));
	 * });
	 * // listen on all elements wrapper
	 * $.arrive(function(){
	 * console.log($(this));
	 * });
	 * ```
	 * Add event to added element on dom
	 * @todo listen new dom element added
	 * @param target pseudo selector
	 * @param callback callback function
	 */
	arrive(target?: string | any, callback: any): any;
	/**
	 * User framework
	 * @copyright Universal PHPJS Framework
	 */
	user: user;
	/**
	 * Generates a GUID string.
	 * @returns The generated GUID.
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @author Slavik Meltser.
	 * @link http://slavik.meltser.info/?p=142
	 * @copyright Universal PHPJS Framework
	 */
	guid(): String;
}

/**
 * Progressbar timer
 */

/**
 * Arrays
 */
interface Array<T> {
	/**
	 * Array unique
	 */
	unique: () => Array<T>;
}

interface HTMLElement
	extends Element,
		DocumentAndElementEventHandlers,
		ElementCSSInlineStyle,
		ElementContentEditable,
		GlobalEventHandlers,
		HTMLOrSVGElement {
	mozMatchesSelector: (selectors: string) => boolean;
	msMatchesSelector: (selectors: string) => boolean;
	[attachEvent: string]: any;
}

/**
 * Window Start
 */
// Add IE-specific interfaces to Window
interface Window {
	attachEvent(event: string, listener: EventListener): boolean;
	detachEvent(event: string, listener: EventListener): void;
	[func: string]: any;
	HTMLElement: HTMLElement;
	user: user;
	/**
	 * Opera navigator
	 */
	readonly opera: string;
	dataLayer: [];
	gtag(message?: any, ...optionalParams: any[]): void;
	mozRTCPeerConnection: any;
}
