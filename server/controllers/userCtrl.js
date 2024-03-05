const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require("axios");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password, username } = req.body;

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            const chatUser = await Users.findOne({ username })
            if (chatUser) return res.status(400).json({ msg: "The username is already exist." })

            const secret = Math.floor(Math.random() * 100)


            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at least 6 characters long." })
            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash, username, secret: secret, isConfirmed: false
            })

            // Save mongodb
            await newUser.save()

            // Send an email Verification
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "autoroomtn@gmail.com",
                    pass: "28292640848199 ",
                    clientId: "841094441629-r03bt8k7u2cfjtrvn8nm2r2u02pu3tjj.apps.googleusercontent.com",
                    clientSecret: "usWROIuueZO8T6_pbx0Pejqq",
                    refreshToken: "1//04LGoyq0TYc3hCgYIARAAGAQSNwF-L9IrxSpPDK-4X0lwK7KxkagCGd46NKBsCwBo0bRCwyYfFHP7cGIqzj4d2MXiBNXsmNNg5w0"
                }
            });

            let mailOptions = {
                from: "autoroomtn@gmail.com",
                to: email,
                subject: "Verification du compte",
                text: "Salut " +
                    name +
                    ",\n\n" +
                    "Veuillez vérifier votre compte en cliquant sur le lien :  \nhttp://" +
                    "localhost:3000" +
                    "/emailConfirmed" +
                    "/" +
                    email +


                    "\n\nMerci ! \n"
            };

            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log("Email sent successfully");
                }
            });

            //Create a user in Chat Engine
            await axios.post("https://api.chatengine.io/users/", { username, secret }, {
                headers: {
                    "Content-Type": "application/json",
                    "PRIVATE-KEY": "78eb0480-62ce-4933-902c-0e329a00ecc8"
                }
            })


            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken, user: newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    confirmEmail: async (req, res, next) => {

        Users.findOne(
            { email: req.params.email },
            function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({
                        message:
                            "Nous n'avons pas pu trouver d'utilisateur pour cette vérification. Inscrivez vous s'il vous plait!",
                    });
                }
                // user is already verified
                else if (user.isConfirmed) {
                    return res
                        .status(200)
                        .send("L'utilisateur a déjà été vérifié. Veuillez vous connecter");
                }
                // verify user
                else {
                    // change isVerified to true
                    user.isConfirmed = true;
                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ message: err.message });
                        }
                        // account successfully verified
                        else {
                            return res
                                .status(200)
                                .send("Votre compte a été vérifié avec succès");
                        }
                    });
                }
            }
        );
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            if (user.isConfirmed == false) {
                return res.status(400).json({ msg: "Email is not Confirmed" });
            }

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken, user })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await Users.find({}).select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUserRole: async (req, res) => {
        try {
            const uid = req.params?.id;
            if (!uid) return res.status(400).json({ msg: "Invalid userid." })
            const {role} = req.body;
            if (!role && role != 0) return res.status(400).json({ msg: "Missing role." })

            const u = await Users.findOneAndUpdate({_id: uid}, {role});
            if (!uid) return res.status(400).json({ msg: "Role update failed." })

            return res.json(u)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUsers: async (req, res) => {
        try {
            const {users} = req.body;
            await Users.deleteMany({_id: {$in: users}});
            res.json({msg: 'Deleted successfully'});
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUserInfo: async (req, res) => {
        try {
            let { name, email, password, confirmPassword, description, birthdate, usrimg } = req.body;

            if (!name) return res.status(400).json({ msg: "Name missing." });
            // if (!usrimg) return res.status(400).json({msg: "User image missing."});
            if (!email) return res.status(400).json({ msg: "Email missing." });
            if (!description) return res.status(400).json({ msg: "Description missing." });
            if (!birthdate) return res.status(400).json({ msg: "Birthdate missing." });
            if (password && !confirmPassword) return res.status(400).json({ msg: "Confirm password missing." });

            if (!validateEmail(email)) return res.status(400).json({ msg: "Invalid emails." })
            if (password) {
                if (password.length < 6) return res.status(400).json({ msg: "Password is at least 6 characters long." })
                if (password != confirmPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match." });

                // Password Encryption
                password = await bcrypt.hash(password, 10)
            }

            updateData = {
                name,
                email,
                description,
                DateNaissance: new Date(birthdate)
            }
            if (password) {
                updateData.password = password
            }
            if (usrimg) {
                updateData.usrimg = usrimg;
            }
            const u = await Users.findByIdAndUpdate(req.user.id, updateData);
            if (!u) return res.status(400).json({ msg: "Update failed." });

            delete updateData.password;
            res.json(updateData);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: "Error." })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    /* history: async(req, res) =>{
          try {
              const history = await Payments.find({user_id: req.user.id})
  
              res.json(history)
          } catch (err) {
              return res.status(500).json({msg: err.message})
          }*/

}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl

