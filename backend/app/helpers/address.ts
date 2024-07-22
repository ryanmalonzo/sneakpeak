import axios from 'axios';
import { FormattedAddress } from './interfaces';

export const formatAddress = async (
  address: string,
): Promise<FormattedAddress> => {
  const config = {
    method: 'get',
    url:
      'https://api.geoapify.com/v1/geocode/search?text=' +
      encodeURIComponent(address) +
      '&apiKey=' +
      process.env.VITE_GEOAPIFY_API_KEY,
    headers: {},
  };

  try {
    const response = await axios(config);
    if (response.data.features.length === 0) {
      throw new Error('Invalid address');
    }

    const properties = response.data.features[0].properties;

    return {
      street:
        [properties.housenumber, properties.street].join(' ').trim() || '',
      city: properties.city || '',
      state: properties.state || '',
      country: properties.country || '',
      zip: properties.postcode || '',
    };
  } catch (error) {
    throw new Error('Invalid address');
  }
};
