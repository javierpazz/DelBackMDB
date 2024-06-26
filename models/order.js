const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
],
    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },

itemsPrice: { type: Number },
shippingPrice: { type: Number },
taxPrice: { type: Number },
totalPrice: { type: Number },
id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
id_delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
id_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
},

isPaid: { type: Boolean, default: false },
isDelivered: { type: Boolean, default: false },
paidAt: { type: Date },
ordYes: { type: String },
status: { type: String},

staOrd: { type: String},
lat: { type: Number },
lng: { type: Number },
timestamp: { type: Number },



  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

const db = require('../config/config');


Invoice.findByStatus = async (status, result) => {

    try {

        const data = await Invoice.find({status : status})
        .populate('id_client','name')
        .populate('id_address','address neighborhood lat lng');                
        result(null, data);

} catch (error) {
    err = error;
    console.log('Error:', err);
    result(err, null);
    }

};

Invoice.findByDeliveryAndStatus = async (id_delivery, status, result) => {

    try {

        const data = await Invoice.find({status : status, id_delivery : id_delivery})
        .populate('id_client','name')
        .populate('id_address','address neighborhood lat lng');                
        result(null, data);

} catch (error) {
    err = error;
    console.log('Error:', err);
    result(err, null);
    }

}

Invoice.findByClientAndStatus = async (id_client, status, result) => {

    try {
        const data = await Invoice.find({status : status, id_client : id_client})
        .populate('id_client','name')
        .populate('id_address','address neighborhood lat lng');                
        result(null, data);

} catch (error) {
    err = error;
    console.log('Error:', err);
    result(err, null);
    }

    
}

Invoice.create = async (order, result) => {

    const newInvoice = new Invoice({
        invoiceItems: order.products.map((x) => ({
          ...x,
          product: x._id,
        })),
        id_client: order.id_client,
        user: order.id_client,
        id_delivery: order.id_delivery,
        id_address: order.id_address,
        lat: order.lat,
        lng: order.lng,
        status: "PAGADO",
        timestamp: Date.now(), 
//
        // shippingAddress: order.shippingAddress,
        // itemsPrice: order.itemsPrice,
        // shippingPrice: order.shippingPrice,
        // taxPrice: order.taxPrice,
        // totalPrice: order.totalPrice,
        shippingAddress: {
            fullName: 'kiki',
            address: 'pasaje ant 423',
            city: 'yb',
            postalCode: '4107',
            country: 'argentina',
            location: {
              lat: '23495874985798',
              lng: '84275487598424',
              address: 'pje ant',
              name: 'tucuman',
              vicinity: 'san miguel',
              googleAddressId: '238798',
            },
          },
      

        // shippingAddress: order.shippingAddress,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
        ordYes: 'Y',
        staOrd: "NUEVA",
//
      });
      const invoice = await newInvoice.save(
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id de la nueva orden:', res._id);
                result(null, res._id);
            }
        }

      );
    }


Invoice.updateToDispatched = async (id_order, id_delivery, result) => {
    const invoiceR = await Invoice.findById(id_order); 
    if (invoiceR) {
        invoiceR.id_delivery = id_delivery,
        invoiceR.status = 'DESPACHADO',
        invoiceR.updated_At = new Date()
        let invoiceRe = await invoiceR.save(
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    result(null, id_order);
                }
            }
          );
    } else {
        console.log('problema con find');
    }
  }

Invoice.updateToOnTheWay = async (id_order, id_delivery, result) => {
    const invoiceR = await Invoice.findById(id_order); 
    if (invoiceR) {
        // invoiceR.id_delivery = id_delivery,
        invoiceR.status = 'EN CAMINO',
        invoiceR.updated_At = new Date()
        let invoiceRe = await invoiceR.save(
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    result(null, id_order);
                }
            }
          );
    } else {
        console.log('problema con find');
    }
  }


Invoice.updateToDelivered = async (id_order, id_delivery, result) => {

    const invoiceR = await Invoice.findById(id_order); 
    if (invoiceR) {
        // invoiceR.id_delivery = id_delivery,
        invoiceR.status = 'ENTREGADO',
        invoiceR.updated_At = new Date()
        let invoiceRe = await invoiceR.save(
            (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    result(null, id_order);
                }
            }
          );
    } else {
        console.log('problema con find');
    }
  }


module.exports = Invoice;