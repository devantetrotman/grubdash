const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function bodyHasAllProperty(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (!name || name === "") {
        next({
            status: 400,
            message: "A 'name' property is required.",
          });
    }
    if (!description || description === "") {
        next({
            status: 400,
            message: "A 'description' property is required.",
          });
    }
    if (!price || price < 0){
        next({
            status: 400,
            message: "A 'price' property is required and must be above zero.",
          });
        }
    if (!Number.isInteger(price)){
        next({
            status: 400,
            message: "The 'price' property must an integer.",
          });
        
    }
    if (!image_url || image_url == ""){
        next({
            status: 400,
            message: "image_url",
          });
    }
    
    
    return next();
    
  }

  function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
      return next();
    }
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }

// TODO: Implement the /dishes handlers needed to make the tests pass
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
      id: dishes.length + 1, 
      name,
      description,
      price,
      image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }
  
  function list(req, res) {
    res.json({ data: dishes });
    };
  
  function read(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    res.json({ data: foundDish });
    }
  
  function update(req, res, next) {
        const { dishId } = req.params;
        const foundDish = dishes.find((dish) => dish.id === dishId);
        const originalId = foundDish.id;
        const originalName = foundDish.name;
        const originalDescription = foundDish.description;
        const originalPrice = foundDish.price;
        const originalImage = foundDish.image_url;
        const { data: { id, name, description, price, image_url } = {} } = req.body;
  
        if (originalName !== name) {
          foundDish.name = name;
        }
        if (originalPrice !== price) {
            foundDish.price = price;
          }
        if (originalDescription !== description) {
            foundDish.description = description;
          }
        if (originalImage !== image_url) {
            foundDish.image_url = image_url;
          }
          if (id){
            if (id !== originalId){
                next({
                    status: 400,
                    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
                });
            }
        }
      
        res.json({ data: foundDish });
    }
  
  module.exports = {
      create: [bodyHasAllProperty, create],
      list,
      read: [dishExists, read],
      update: [dishExists, bodyHasAllProperty, update],
    };