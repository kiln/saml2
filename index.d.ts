export type ServiceProviderOptions = {
	entity_id: string;
	private_key: string;
	certificate: string;
	assert_endpoint: string;
};

export type IdentityProviderOptions = {
	sso_login_url: string;
	sso_logout_url?: string;
	certificates?: string[];
	force_authn: boolean;
	sign_get_request: boolean;
	allow_unencrypted_assertion: boolean;
};

export type SAMLUser = {
	name_id: string;
	session_index: string;
	attributes?: Record<string, string | string[]>;
};

export type SAMLResponse = {
	user: SAMLUser;
};

export type SAMLLogoutRequest = {
	type: "logout_request";
	name_id: string;
	session_index: string;
	response_header: { id: string };
	RelayState?: string;
};

export type SAMLLogoutResponse = {
	type: "logout_response";
};

export type SAMLRequestResponse = SAMLLogoutRequest | SAMLLogoutResponse;

export class ServiceProvider {
	constructor(options: ServiceProviderOptions);
	create_metadata(): string;
	create_login_request_url(
		idp: IdentityProvider,
		options: Record<string, unknown>,
		callback: (err: Error | null, login_url: string, request_id: string) => void,
	): void;
	post_assert(
		idp: IdentityProvider,
		options: { request_body: Record<string, unknown> },
		callback: (err: Error | null, saml_response: SAMLResponse) => void,
	): void;
	redirect_assert(
		idp: IdentityProvider,
		options: { request_body: Record<string, unknown> },
		callback: (err: Error | null, saml_reqrep: SAMLRequestResponse) => void,
	): void;
	create_logout_request_url(
		idp: IdentityProvider,
		options: { name_id?: string; session_index?: string },
		callback: (err: Error | null, logout_url: string) => void,
	): void;
	create_logout_response_url(
		idp: IdentityProvider,
		options: { in_response_to: string; relay_state?: string },
		callback: (err: Error | null, response_url: string) => void,
	): void;
}

export class IdentityProvider {
	constructor(options: IdentityProviderOptions);
}
