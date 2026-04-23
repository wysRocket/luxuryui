function requiredEnv(name: string): string {
	const value = Deno.env.get(name);
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value;
}

export async function verifyFirebaseToken(
	idToken: string,
): Promise<{ uid: string; email?: string }> {
	const apiKey = requiredEnv("FIREBASE_WEB_API_KEY");

	const response = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ idToken }),
		},
	);

	const data = await response.json();

	if (!response.ok || !data.users?.[0]) {
		throw new Error("Invalid or expired Firebase token.");
	}

	const user = data.users[0];

	if (user.disabled) {
		throw new Error("Firebase account is disabled.");
	}

	return {
		uid: String(user.localId),
		email: typeof user.email === "string" ? user.email : undefined,
	};
}
