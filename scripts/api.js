export async function getData(customerID = '', propertyID = '') {
    const apiUrl = `https://7bzqu41xz9.execute-api.us-east-1.amazonaws.com/dev/photos?customerID=${customerID}&propertyID=${propertyID}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

