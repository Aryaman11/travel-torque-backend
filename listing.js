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
    console.log(">>>>>>> query",req.query);
    let country = req.query.country;
  try{

      console.log(">>>>>>> query")
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
  }catch{
   console.log(">>>>>>> query")
  }
}