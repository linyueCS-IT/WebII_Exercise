import { ServerResponse } from "http";

export enum StatusCode {
	OK = 200,
	Created = 201,
	BadRequest = 400,
	NotFound = 404,
	InternalServerError = 500,
}

/**
 * A class that wraps the `ServerResponse` object and provides
 * a method for sending JSON responses. This class is used by
 * the Router to send responses to the client. It is also used
 * by the controllers to send responses to the client.
 */
export default class Response {
	private res: ServerResponse;

	constructor(res: ServerResponse) {
		this.res = res;
	}

	/**
	 * Sends a JSON response to the client. The response is
	 * formatted as an object with a `message` property and a
	 * `payload` property. The `message` property is a string
	 * that describes the response. The `payload` property is
	 * an object that contains the data to be sent to the client.
	 * @param statusCode
	 * @param message
	 * @param payload
	 */
	send = (statusCode: StatusCode, message: string, payload: any = {}) => {
		this.res.writeHead(statusCode, { "Content-Type": "application/json" });
		console.log(
			`<<< ${statusCode} ${message} ${JSON.stringify(payload, null, 2)}`,
		);
		this.res.end(JSON.stringify({ message, payload }));
	};
}
