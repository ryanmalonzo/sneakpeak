export interface SortOptions {
  [key: string]: 1 | -1;
}

export interface FilterOptions {
  [key: string]: unknown;
}

export interface FormattedAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface FormattedAddressError {
  error: string;
}
