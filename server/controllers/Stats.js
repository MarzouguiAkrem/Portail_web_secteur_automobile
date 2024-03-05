const Users = require('../models/userModel')
const Topics = require("../models/topicModel")
const Articles = require("../models/productModel")
const stats = {
    getProfessionals: async (req, res) => {

        try {


            const professionals = await Users.find({});


            return res.status(200).json({ professionals, length: professionals.length });

        } catch (error) {
            console.log(error)
        }
    }
    , getTopics: async (req, res) => {
        try {
            const topics = await Topics.find({})
            return res.status(200).json(topics);

        } catch (error) {
            console.log(error)
        }
    }, getArticles: async (req, res) => {
        try {
            const articles = await Articles.find({})
            return res.status(200).json(articles);

        } catch (error) {
            console.log(error)
        }

    }
}




module.exports = stats;
