// const mercadopago = require('mercadopago');
import { MercadoPagoConfig, Preference } from "mercadopago";

export const createOrder = async (req, res, next) => {
  const client = new MercadoPagoConfig({
    accessToken:
      "TEST-5688782224009186-101110-0ecbd49d3584d3126966b1ebcc376a2e-1508598374",
  });
  // mercadopago.configure({
  //   access_token:
  //     'TEST-5688782224009186-101110-0ecbd49d3584d3126966b1ebcc376a2e-1508598374',
  // });
  const preference = new Preference(client);

  // console.log(client);
  // console.log(preference);

  const payload = {
    items: [
      { title: "Laptop", unit_price: 100, currency_id: "ARS", quantity: 1 },
    ],
    back_urls: { success: "http://localhost:8000/api/v1/pago/success" },
  };

  try {
    const result = await preference.create({ body: payload });

    console.log(result);
  } catch (err) {
    console.log(err);
  }

  res.send("creando orden");
};

export const receiveWebHook = (req, res) => {
  console.log(req.query);
  res.send("webhook");
};
