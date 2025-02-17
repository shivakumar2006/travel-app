import axios from 'axios'; 


// Store API key securely
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY; // Use environment variables

console.log("api key: ", API_KEY);

export const getPlacesData = async (type, sw, ne) => {
    try {
        const response = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
            },
            headers: {
                'x-rapidapi-key': API_KEY, 
                'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
            }
        });

        console.log("📌 API Response:", response.data); // Debugging log

        return response.data?.data || []; // Safely return data or empty array
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        return []; // Return empty array on error to prevent app crash
    }
};
