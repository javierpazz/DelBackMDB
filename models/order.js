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
// itemsPrice: { type: Number },
// shippingPrice: { type: Number },
// taxPrice: { type: Number },
// totalPrice: { type: Number },
id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
id_delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
id_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
},
lat: { type: Number },
lng: { type: Number },
status: { type: String},
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
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
        totalBuy: order.totalBuy,
        id_client: order.id_client,
        id_address: order.id_address,
        id_delivery: order.id_delivery,
        lat: order.lat,
        lng: order.lng,
        status: "PAGADO",
        TIMESTAMP: Date.now(), 
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


Invoice.updateToDispatched = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'DESPACHADO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Invoice.updateToOnTheWay = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'EN CAMINO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Invoice.updateToDelivered = (id_order, id_delivery, result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            id_delivery,
            'ENTREGADO',
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}


module.exports = Invoice;