const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://aryamanyash11:Aryaman11@cluster0.pwvo6oj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async function(req,res){
    
    let country = req.query.country;
  try{
    let data = []
      if(Object.keys(req.query).length == 0){
        console.log(">>>>>>> query -----1");
         let data = await client.db("sample_airbnb").collection("listingsAndReviews").aggregate([
    {
      $match : {"minimum_nights":  "1"}
    },
          {
      
      $project: {
        _id: 1,
        name:1,
        summary:1,
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
        tax: {
                $convert: {
                input: "$cleaning_fee",
                to: "double",
                onError: 0.0,  // If conversion fails, return 0.0
                onNull: 0.0    // If field is null, return 0.0
                }},
        photo : "$images.picture_url",
        review_count:"$number_of_reviews",
      }
    }
       ]).limit(10).toArray()
      
        res.json({
        status: "200",
        message: "success",
        response: data
        })

      }
      else if(country){
        let data = await client.db("sample_airbnb").collection("listingsAndReviews").aggregate([
    {
      $match: {
        "address.country": country
      }
      },{
      $project: {
        _id: 1,
        name:1,
        summary:1,
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
        tax: {
                $convert: {
                input: "$cleaning_fee",
                to: "double",
                onError: 0.0,  // If conversion fails, return 0.0
                onNull: 0.0    // If field is null, return 0.0
                }},
        photo : "$images.picture_url",
        review_count:"$number_of_reviews",
      }
     }
     ]).toArray()

      res.json({
      status: "200",
      message: "success",
      response: data
      })

      }



 
  }catch(err){
   console.log(">>>>>>> error",err)
  }
}