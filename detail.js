const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://aryamanyash11:Aryaman11@cluster0.pwvo6oj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async function(req,res) {
    let id = req.query.id;
      try{
      let data = await client.db("sample_airbnb").collection("listingsAndReviews").aggregate([
        {
          $match: {_id: id}
        },
        {
          $project: {
            
          _id: 0 ,
          bathrooms : 0,
          listing_url: 0,
          // interaction: 1,
          minimum_nights: 0 ,
          maximum_nights: 0,
          cancellation_policy: 0,
          last_scraped: 0,
          calendar_last_scraped: 0,
          first_review : 0,
          last_review: 0,
          accommodates: 0,
          beds: 0,
          guests_included: 0 ,
          price:0,
          security_deposit:0,
          cleaning_fee:0,
          extra_people:0,
          
          // photo: "$images.picture_url",  

          
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
        response: data,
      });
    }
    catch(err){
      console.log(">>>>>",err);
    }

}


