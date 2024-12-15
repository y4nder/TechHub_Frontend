import {formatNumberToK} from "@/utils/formatters/numberFomatter.js";

export function convertToTypedValue(item) {
	const result = {};

	switch (item.type.toLowerCase()) {
		case 'integer':
			result.label = item.label;
			result.value = formatNumberToK(parseInt(item.value, 10) || 0); // Default to 0 if parsing fails
			break;

		case 'decimal':
			result.label = item.label;
			result.value = parseFloat(item.value) || 0.0; // Default to 0.0 if parsing fails
			break;

		case 'string':
			result.label = item.label;
			result.value = item.value;
			break;

		case 'boolean':
			result.label = item.label;
			result.value = item.value.toLowerCase() === 'true'; // Converts string 'true'/'false' to boolean
			break;

		default:
			result.label = item.label;
			result.value = item.value; // Default to string if type is unknown
			break;
	}

	return result;
}
