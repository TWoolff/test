const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';

export async function getGifForTeam(teamName: string): Promise<string | null> {
  try {
    const response = await fetch(`${GIPHY_API_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(teamName)}&limit=1&rating=g`);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].images.original.url;
    }
    return null;
  } catch (error) {
    console.error('Error fetching GIF:', error);
		return null;
	}
}
