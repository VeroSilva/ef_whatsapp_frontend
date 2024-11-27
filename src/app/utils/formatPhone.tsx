export const formatPhoneNumber = (number: string): string => {
    const countryCode = getCountryCode(number);

    if (!countryCode) {
        // If no valid country code is found, return the number without formatting
        return number;
    }

    const formattedCountryCode = `+${countryCode}`;
    let formattedNumber = number.slice(countryCode.length);

    // Apply specific formatting based on the country code
    if (countryCode === '51') {
        formattedNumber = `${formattedNumber.slice(0, 3)} ${formattedNumber.slice(3, 6)} ${formattedNumber.slice(6)}`;
    }

    return `${formattedCountryCode} ${formattedNumber}`;
}

function getCountryCode(number: string): string | null {
    const countryCodes = ['51'];

    if (!number) return null;

    for (const code of countryCodes) {
        if (number.startsWith(code)) {
            return code;
        }
    }

    return null;
}