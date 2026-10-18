export type PartnerDetails = {
  organization: string;
  email: string;
  area: string;
  details: string;
};
export function partnerErrors(data: PartnerDetails) {
  const errors: Partial<Record<keyof PartnerDetails, string>> = {};
  if (!data.organization.trim() || data.organization.length > 160)
    errors.organization = "Enter an organization name (up to 160 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = "Enter a valid contact email.";
  if (!data.area.trim() || data.area.length > 160)
    errors.area = "Enter a town or ZIP code (up to 160 characters).";
  if (data.details.trim().length < 10 || data.details.length > 3000)
    errors.details = "Include a few practical details (10–3,000 characters).";
  return errors;
}
