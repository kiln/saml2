export type ServiceProviderOptions = {
	entity_id: string;
	private_key: string;
	certificate: string;
	assert_endpoint: string;
	/**
	 * Additional private keys (PEM format strings) to try, in order, after
	 * `private_key` when decrypting an encrypted assertion. Useful for
	 * continuing to accept assertions encrypted to an old certificate during
	 * a certificate rollover.
	 */
	alt_private_keys?: string[];
	/**
	 * Additional certificates (PEM format strings) published in the service
	 * provider metadata (as both signing and encryption certificates)
	 * alongside `certificate`. Useful for staging a new certificate during a
	 * certificate rollover.
	 */
	alt_certs?: string[];
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
	/**
	 * Index of the service provider private key that decrypted the assertion:
	 * `0` means `private_key`, `n` means `alt_private_keys[n - 1]`. Undefined
	 * when the assertion was not encrypted.
	 */
	decryption_key_index?: number;
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
