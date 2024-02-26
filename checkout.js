const express = require('express');
const app = express();
const cors = require('cors'); 
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
const uri = "mongodb+srv://aryamanyash11:Aryaman11@cluster0.pwvo6oj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async (req,res) => {
    let id = req.query.id;
      try{
      let data = await client.db("sample_airbnb").collection("listingsAndReviews").aggregate([
        {
          $match: {_id: id}
        },
        {
          $project: {
            _id:0,
            name:1,
            photo : "$images.picture_url",
            review_count:"$number_of_reviews",
            tax: {
                $convert: {
                input: "$cleaning_fee",
                to: "double",
                onError: 0.0,  // If conversion fails, return 0.0
                onNull: 0.0    // If field is null, return 0.0
                }},
            
            overall_rating:{
               $avg: [
                "$review_scores.review_scores_accuracy", 
                "$review_scores.review_scores_cleanliness", 
                "$review_scores.review_scores_checkin", 
                "$review_scores.review_scores_communication", 
                "$review_scores.review_scores_location", 
                "$review_scores.review_scores_value"
            ]
            },
            price:{
                $convert:{
                    input: "$price",
                    to: "double",
                    onError: 0.0,  // If conversion fails, return 0.0
                    onNull: 0.0    // If field is null, return 0.0
                }
            },
            property_type:1,
            room_type:1,
            bed_type:1,


          }
        },
        
      ])
      
      .toArray();
      if(data.length === 0)
      res.json({
        status: "500",
        message: "data not found",
        response: {},
      });
      res.json({
        status: "200",
        message: "success",
        response: data[0],
      });
    }
    catch(err){
      console.log(">>>>>",err);
    }
} 

