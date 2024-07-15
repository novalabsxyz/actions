import { MOBILE_MINT } from '@helium/spl-utils';
import axios from 'axios';
import qs from 'qs';

const sphereUrl = 'https://api.spherepay.co';
const SPHERE_API_KEY = 'restrictedSecret_fe04ea7170484eeb8841445ef0082406';

type SphereTaxRate = {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  type: 'valueAddedTax';
  percentageBps: string;
  percentageDecimal: string;
  inclusive: boolean;
};

type SphereShippingFee = {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  taxBehavior: string;
  type: string;
  flatAmount: string;
};

const getConfig = {
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${SPHERE_API_KEY}`,
  },
};

export const createHeliumApi = () => {
  const getTaxRate = async (state: string) => {
    try {
      const response = await axios.get(
        `${sphereUrl}/v1/taxRate?limit=60`,
        getConfig,
      );

      const taxRates = response.data.data.taxRates as SphereTaxRate[];
      return taxRates.find((rate) => rate.state === state);
    } catch {}
  };

  const getShippingFee = async (state: string) => {
    try {
      const response = await axios.get(
        `${sphereUrl}/v1/shippingRate?limit=60`,
        getConfig,
      );

      const shippingFees = response.data.data
        .shippingRates as SphereShippingFee[];

      return shippingFees.find((fee) => fee.state === state);
    } catch {}
  };

  const createHotspotTxn = async ({
    hotspotPaymentLinkId,
    email,
    firstName,
    lastName,
    city,
    line1,
    line2,
    postalCode,
    state,
    lineItems,
    taxRate,
    shippingFee,
    account,
  }: {
    hotspotPaymentLinkId: string;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    line1: string;
    line2: string;
    postalCode: string;
    state: string;
    lineItems: any;
    taxRate: SphereTaxRate;
    shippingFee: SphereShippingFee;
    account: string;
  }) => {
    const sphereResponse = await axios.post(
      `${sphereUrl}/v1/public/paymentLink/pay/${hotspotPaymentLinkId}?${qs.stringify(
        {
          inputMint: MOBILE_MINT.toBase58(),
          email,
          firstName,
          lastName,
          phoneNumber: '',
          city,
          line1,
          line2,
          postalCode,
          country: 'USA',
          state,
          lineItems: JSON.stringify(lineItems),
          taxRate: taxRate?.id,
          shippingRate: shippingFee?.id,
        },
      )}`,
      {
        account,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return sphereResponse;
  };

  return {
    getTaxRate,
    getShippingFee,
    createHotspotTxn,
  };
};

const heliumApi = createHeliumApi();

export default heliumApi;
