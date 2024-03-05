const Topics = require('../models/topicModel')

const topicCtrl = {
    getTopics: async (req, res) => {
        try {
            const topics = await Topics.find()

            res.json({ topics })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createTopic: async (req, res) => {
        try {
            const { topic_id, title, description, price, images } = req.body;
            if (!images) return res.status(400).json({ msg: "No image upload" })

            const top = await Topics.findOne({ title: title.toLowerCase() });
            console.log(top)
            if (top)
                return res.status(400).json({ msg: "This Topic already exists." })
            const newTopic = await Topics.create({
                topic_id, title: title.toLowerCase().trim(), description, price, images
            })

            return res.json({ msg: "Created a topic" })

        } catch (err) {
            return res.status(500).json({ msg: "this Topic Already exist !" })
        }
    },
    deleteTopic: async (req, res) => {
        try {
            await Topics.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a Topic" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateTopic: async (req, res) => {
        try {
            const { title, description, price, images } = req.body;
            if (!images) return res.status(400).json({ msg: "No image upload" })

            await Topics.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), description, price, images
            })

            res.json({ msg: "Updated a Product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    reviews: async (req, res) => {
        try {
            const { rating } = req.body

            if (rating && rating !== 0) {
                const topic = await Topics.findById(req.params.id)
                if (!topic) return res.status(400).json({ msg: 'Topic does not exist.' })

                let num = topic.numReviews
                let rate = topic.rating

                await Topics.findOneAndUpdate({ _id: req.params.id }, {
                    rating: rate + rating, numReviews: num + 1
                })

                res.json({ msg: 'Update success' })

            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}


module.exports = topicCtrl