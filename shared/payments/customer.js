const REQUIRED_CUSTOMER_FIELDS = [
	"firstName",
	"lastName",
	"email",
	"phone",
	"countryCode",
	"city",
];

function cleanString(value) {
	return String(value || "").trim();
}

export function normalizeCustomerProfile(input = {}) {
	return {
		firstName: cleanString(input.firstName),
		lastName: cleanString(input.lastName),
		email: cleanString(input.email).toLowerCase(),
		phone: cleanString(input.phone),
		countryCode: cleanString(input.countryCode).toUpperCase(),
		city: cleanString(input.city),
	};
}

export function getMissingCustomerFields(input = {}) {
	const normalized = normalizeCustomerProfile(input);
	return REQUIRED_CUSTOMER_FIELDS.filter((field) => !normalized[field]);
}

export function listRequiredCustomerFields() {
	return [...REQUIRED_CUSTOMER_FIELDS];
}
