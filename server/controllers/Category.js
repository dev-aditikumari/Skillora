
const Category= require("../models/Category");


// Create a category (admin , only)

exports.createCategory = async(req , res)=>{
    try {
    // TODO 1: get name and description from req.body
    // TODO 2: guard: no name → 400 "Category name is required"
    // TODO 3: create it → const category = await Category.create({ name, description })
    // TODO 4: return 201 { success: true, message: "Category created", category }
    const name = req.body.name;
    const description  = req.body.description;
    if(!name){
      return   res.status(400).json({success: false , message:"Category name is required"})
    }
    const category = await Category.create({name , description});
    return res.status(201).json({success: true , message:"Category created successfully" , category});
  } catch (err) {
    // TODO 5: console.error(err)
    //   Special case: if err.code === 11000 → 409 "Category already exists"
    //   (11000 is MongoDB's "duplicate key" error. Your model has unique: true on name)
    //   otherwise → 500 "Could not create category"
    console.error(err);
    if(err.code === 11000){
        return res.status(409).json({success: false , message: "Category already exists"})
    }
    return res.status(500).json({success: false , message: "Could not create category"})

  }

};

exports.showAllCategories = async(req , res)=>{
    try{
        // TODO 6: const categories = await Category.find({}, { name: true, description: true })
    //   (the second argument picks only those fields, so you don't send the course lists)
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
      select :"courseName  courseDescription price thumbnail instructor createdAt",
      populate:{path:"instructor" , select:"firstName lastName"}
    });

    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, data: { selectedCategory } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch category page details" });
  }
};