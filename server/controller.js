require('dotenv').config()
let {CONNECTION_URI} = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_URI, {
    dialect : 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorization:false
        }
    }
});
const userID= 4;
const clientID = 3; 

module.exports={
    getUserInfo: (req,res) =>{
        sequelize.query(`SELECT * FROM cc_clients AS c 
        JOIN cc_users AS u
        ON c.user_id = u.user_id
        WHERE u.user_id = ${userID};
        `)
        .then(dbRes => {
            console.log(dbRes[0]);
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    updateUserInfo: (req,res) => {
        let {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            city,
            state,
            zipCode,
        } = req.body
        sequelize.query(`
        UPDATE cc_users SET
            first_name = '${firstName}',
            last_name = '${lastName}',
            email = '${email}',
            phone_number = ${phoneNumber}
            WHERE user_id = ${userID};

        UPDATE cc_clients SET
            address = '${address}',
            city = '${city}',
            state = '${state}',
            zip_code = ${zipCode}
            WHERE user_id = ${userID}
    `)

        .then(()=> res.sendStatus(200))
        .catch( err=>console.log(err) )
    },
    getUserAppt: (req,res) => {
        sequelize.query(`
        select * from cc_appointments
        where client_id = ${clientID}
        order by date DESC;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    requestAppointment : (req,res)=>{
        const {date, service} = req.body 

        sequelize.query(`insert into cc_appointments (client_id, date, service_type, notes, approved, completed)
        values (${clientID}, '${date}', '${service}', '', false, false)
        returning *;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    
    }
}