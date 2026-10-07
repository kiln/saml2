// Type-level tests for index.d.ts. This file is compiled (not executed) by
// `npm run test-types`; the `@ts-expect-error` lines assert that the marked
// usage fails to typecheck.
import * as saml2 from "..";

const sp_options: saml2.ServiceProviderOptions = {
	entity_id: "https://sp.example.com/metadata.xml",
	private_key: "PRIVATE KEY",
	certificate: "CERTIFICATE",
	assert_endpoint: "https://sp.example.com/assert",
	alt_private_keys: ["OLD PRIVATE KEY", { name: "example-2026-07", key: "OLDER PRIVATE KEY" }],
	alt_certs: ["OLD CERTIFICATE"],
};

// Keys may be named
const named_sp_options: saml2.ServiceProviderOptions = {
	...sp_options,
	private_key: { name: "example-2026-10", key: "PRIVATE KEY" },
};

// alt_private_keys and alt_certs are optional
const minimal_sp_options: saml2.ServiceProviderOptions = {
	entity_id: "https://sp.example.com/metadata.xml",
	private_key: "PRIVATE KEY",
	certificate: "CERTIFICATE",
	assert_endpoint: "https://sp.example.com/assert",
};

const bad_sp_options: saml2.ServiceProviderOptions = {
	...minimal_sp_options,
	// @ts-expect-error alt_private_keys must be an array
	alt_private_keys: "OLD PRIVATE KEY",
	// @ts-expect-error alt_certs must be an array of strings
	alt_certs: "OLD CERTIFICATE",
};

const bad_named_sp_options: saml2.ServiceProviderOptions = {
	...minimal_sp_options,
	// @ts-expect-error a named key needs a string name
	private_key: { name: 1, key: "PRIVATE KEY" },
};

const sp = new saml2.ServiceProvider(sp_options);
const idp = new saml2.IdentityProvider({
	sso_login_url: "https://idp.example.com/login",
	force_authn: false,
	sign_get_request: false,
	allow_unencrypted_assertion: false,
});

sp.post_assert(idp, { request_body: {} }, (_err, saml_response) => {
	const user: saml2.SAMLUser = saml_response.user;
	const key_name: string | undefined = saml_response.decryption_key_name;

	// @ts-expect-error decryption_key_name may be undefined
	const always_a_string: string = saml_response.decryption_key_name;

	void user;
	void key_name;
	void always_a_string;
});

void sp_options;
void named_sp_options;
void bad_sp_options;
void bad_named_sp_options;
