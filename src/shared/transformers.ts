/**
 * Transformation utilities for converting between API inputs and GraphQL structures
 */

import {
  EmailsComposite,
  PhonesComposite,
  LinkComposite,
  AddressComposite,
  CurrencyComposite,
} from "./types.js";

/**
 * Transform email string to EmailsComposite
 */
export function transformEmail(email: string): EmailsComposite {
  return {
    primaryEmail: email,
    additionalEmails: [],
  };
}

/**
 * Transform phone details to PhonesComposite
 */
export function transformPhone(
  phone: string,
  countryCode?: string,
  callingCode?: string
): PhonesComposite {
  return {
    primaryPhoneNumber: phone,
    primaryPhoneCountryCode: countryCode || "",
    primaryPhoneCallingCode: callingCode || "",
    additionalPhones: [],
  };
}

/**
 * Transform URL to LinkComposite
 */
export function transformLink(url: string, label?: string): LinkComposite {
  return {
    primaryLinkLabel: label || "",
    primaryLinkUrl: url,
    secondaryLinks: [],
  };
}

/**
 * Transform address fields to AddressComposite
 */
export function transformAddress(address: {
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
}): AddressComposite | undefined {
  // Only create address if at least one field is provided
  const hasAnyField = Object.values(address).some((value) => value !== undefined);

  if (!hasAnyField) {
    return undefined;
  }

  const result: AddressComposite = {};

  if (address.addressStreet1) result.addressStreet1 = address.addressStreet1;
  if (address.addressStreet2) result.addressStreet2 = address.addressStreet2;
  if (address.addressCity) result.addressCity = address.addressCity;
  if (address.addressPostcode) result.addressPostcode = address.addressPostcode;
  if (address.addressState) result.addressState = address.addressState;
  if (address.addressCountry) result.addressCountry = address.addressCountry;

  return result;
}

/**
 * Transform amount and currency to CurrencyComposite
 * Converts regular amount to micros (amount * 1,000,000)
 */
export function transformCurrency(
  amount: number,
  currencyCode: string = "USD"
): CurrencyComposite {
  return {
    amountMicros: amount * 1000000, // Convert to micros
    currencyCode,
  };
}

/**
 * Transform CurrencyComposite back to regular amount
 * Converts micros to regular amount (amountMicros / 1,000,000)
 */
export function currencyFromMicros(
  currency: CurrencyComposite
): { amount: number; currencyCode: string } {
  return {
    amount: currency.amountMicros / 1000000,
    currencyCode: currency.currencyCode,
  };
}
