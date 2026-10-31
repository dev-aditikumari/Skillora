
const Category= require("../models/Category");
const { toCourseCard } = require("./Course");

exports.createCategory = async(req , res)=>{
    try {
    const name = req.body.name;
    const description  = req.body.description;
    if(!name){
      return   res.status(400).json({success: false , message:"Category name is required"})
    }
    const category = await Category.create({name , description});
    return res.status(201).json({success: true , message:"Category created successfully" , category});
  } catch (err) {
    console.error(err);
    if(err.code === 11000){
        return res.status(409).json({success: false , message: "Category already exists"})
    }
    return res.status(500).json({success: false , message: "Could not create category"})

  }

};

exports.showAllCategories = async(req , res)=>{
    try{
    const categories = await Category.find({} , {name: true , description : true});
    res.status(200).json({success: true , message : "Categories fetched successfully" , categories})

    }catch(err){
        console.error(err);
        return res.status(500).json(
            {success: false , message:"Unable to fetch categories"}
        )
    }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Category id is required" });
    }

    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      match: { status: "Published" },
      select :"courseName courseDescription price thumbnail instructor createdAt studentsEnrolled ratingAndReviews",
      populate:[
        { path: "instructor", select: "firstName lastName" },
        { path: "ratingAndReviews", select: "rating" },
      ]
    });

    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const category = selectedCategory.toObject();
    category.courses = selectedCategory.courses.map((course) => ({
      ...toCourseCard(course),
      category: { _id: selectedCategory._id, name: selectedCategory.name },
    }));

    return res.status(200).json({ success: true, data: { selectedCategory: category } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch category page details" });
  }
};