const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    image: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    roles: [{
      id : { type: Number, required: true },
      name    : { type: String, required: true },
      image   : { type: String },
      route   : { type: String, required: true },
  }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);



const db = require('../config/config');
const bcrypt = require('bcryptjs');


// User.findById = (id, result) => {

//     const sql = `
//     SELECT
//         U.id,
//         U.email,
//         U.name,
//         U.lastname,
//         U.image,
//         U.phone,
//         U.password,
//         JSON_ARRAYAGG(
//             JSON_OBJECT(
//                 'id', CONVERT(R.id, char),
//                 'name', R.name,
//                 'image', R.image,
//                 'route', R.route
//             )
//         ) AS roles
//     FROM
//         users AS U
//     INNER JOIN
//         user_has_roles AS UHR
//     ON
//         UHR.id_user = U.id
//     INNER JOIN
//         roles AS R
//     ON
//         UHR.id_rol = R.id
//     WHERE
//         U.id = ?
//     GROUP BY
//         U.id
//     `;

//     db.query(
//         sql,
//         [id],
//         (err, user) => {
//             if (err) {
//                 console.log('Error:', err);
//                 result(err, null);
//             }
//             else {
//                 console.log('Usuario obtenido:', user[0]);
//                 result(null, user[0]);
//             }
//         }
//     )

// }

User.findDeliveryMen = async (result) => {

const userR = await User.find((err, res) => {
  if (err) {
      console.log('Error:', err);
      result(err, null);
  }
  else {
      console.log('Usuario obtenido:', res);
      result(null, res);
  }
}
);
}


User.findByEmail = async (email, result) => {

  const userR = await User.findOne({ email },(err, res) => {
    if (err) {
        console.log('Error:', err);
        result(err, null);
    }
    else {
        console.log('Usuario obtenido:', res);
        result(null, res);
    }
}
);
}



  
  User.create = async (user, result) => {
      
    const hash = await bcrypt.hash(user.password, 10);
  
    // console.log('estoy');
    // console.log(user);
  
    const newUser = new User({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      password: bcrypt.hashSync(user.password),
      resetToken: user.resetToken,
      isAdmin: user.isAdmin,
      roles: [{
        id : 1,
        name : "ADMIN",
        image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
        route : "/restaurant/orders/list"
      },
      {
        id : 2,
        name : "REPARTIDOR",
        image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
        route : "/delivery/orders/list"
      },
      {
        id : 3,
        name : "CLIENTE",
        image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
        route : "/client/products/list"
      }
    ],
      });
      let userRe = await newUser.save(
      (err, res) => {
              if (err) {
                  console.log('Error:', err);
                  result(err, null);
              }
              else {
                  console.log('Id del nuevo usuario:', res._id.toString());
                  result(null, res._id.toString());
              }
          }
      );
  
  
  
      }
  
  
  
// User.update = (user, result) => {

//     const sql = `
//     UPDATE
//         users
//     SET
//         name = ?,
//         lastname = ?,
//         phone = ?,
//         image = ?,
//         updated_at = ?
//     WHERE
//         id = ?
//     `;

//     db.query
//     (
//         sql,
//         [
//             user.name,
//             user.lastname,
//             user.phone,
//             user.image,
//             new Date(),
//             user.id
//         ],
//         (err, res) => {
//             if (err) {
//                 console.log('Error:', err);
//                 result(err, null);
//             }
//             else {
//                 console.log('Usuario actualizado:', user.id);
//                 result(null, user.id);
//             }
//         }
//     )
// }

// User.updateWithoutImage = (user, result) => {

//     const sql = `
//     UPDATE
//         users
//     SET
//         name = ?,
//         lastname = ?,
//         phone = ?,
//         updated_at = ?
//     WHERE
//         id = ?
//     `;

//     db.query
//     (
//         sql,
//         [
//             user.name,
//             user.lastname,
//             user.phone,
//             new Date(),
//             user.id
//         ],
//         (err, res) => {
//             if (err) {
//                 console.log('Error:', err);
//                 result(err, null);
//             }
//             else {
//                 console.log('Usuario actualizado:', user.id);
//                 result(null, user.id);
//             }
//         }
//     )
// }

// User.updateNotificationToken = (id, token, result) => {
//     const sql = `
//     UPDATE
//         users
//     SET
//         notification_token = ?,
//         updated_at = ?
//     WHERE
//         id = ?
//     `;

//     db.query(
//         sql,
//         [
//             token,
//             new Date(),
//             id
//         ],
//         (err, res) => {
//             if (err) {
//                 console.log('Error:', err);
//                 result(err, null);
//             }
//             else {
//                 console.log('Usuario actualizado:', id);
//                 result(null, id);
//             }
//         }
//     )
// }

module.exports = User;