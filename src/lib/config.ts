export const service = {
  phone: "+15092069073",
  displayPhone: "(509) 206-9073",
  smsHref: "sms:+15092069073?body=Hi",
};
export const chatEnabled = () => Boolean(process.env.TUMBLEWEED_API_URL);
export const partnersEnabled = () => Boolean(process.env.PARTNER_INTAKE_URL);
