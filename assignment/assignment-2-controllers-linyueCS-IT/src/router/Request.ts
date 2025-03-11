import { IncomingMessage } from "http";

/**
 * A class to represent an HTTP request and provide utility methods for parsing
 * the request body and extracting information from the request URL. This class
 * is used by the Router to handle incoming requests. It is also used by the
 * controllers to parse the request body and extract information from the URL.
 */
export default class Request<T = {}> {
	req: IncomingMessage;
	props?: Partial<T>;

	constructor(req: IncomingMessage) {
		this.req = req;
	}

	/**
	 * Parses the request body as JSON and sets the `props`
	 * property to the parsed object. Rejects the promise if
	 * the request body is not valid JSON.
	 * @returns A promise that resolves to the parsed request body.
	 */
	parseBody = async () => {
		return new Promise((resolve, reject) => {
			let body = "";

			this.req.on("data", (chunk) => {
				body += chunk;
			});

			this.req.on("end", () => {
				let props: Partial<T>;

				try {
					props = JSON.parse(body);
				} catch (error) {
					console.log("Error parsing JSON:", error);
					reject("Request body must be valid JSON");
					return;
				}

				this.props = props;
				resolve(props);
			});
		});
	};

	/**
	 * @returns The URL of the request as a URL object.
	 * @see https://nodejs.org/api/url.html#url_class_url
	 */
	getURL = () => {
		return new URL(this.req.url ?? "", `http://${this.req.headers.host}`);
	};

	/**
	 * @returns The search params of the request URL.
	 * @example http://localhost:3000/todos?completed=true => { completed: "true" }
	 */
	getSearchParams = () => {
		return this.getURL().searchParams;
	};

	/**
	 * @returns The ID from the request URL.
	 * @example http://localhost:3000/todos/1 => 1
	 */
	getId = () => {
		return Number(this.req.url?.split("/")[2]);
	};

	/**
	 * @returns The ID of the sub-todo from the request URL.
	 * @example http://localhost:3000/todos/1/sub-todos/2 => 2
	 */
	getSubTodoId = () => {
		return Number(this.req.url?.split("/")[4]);
	};
}
