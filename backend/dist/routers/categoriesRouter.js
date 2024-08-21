"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesControllers_1 = require("../controllers/categoriesControllers");
const categoriesRouter = (0, express_1.Router)();
categoriesRouter.get('/', categoriesControllers_1.getAllCategories);
categoriesRouter.get('/:id', categoriesControllers_1.getSingleCategory);
// categoriesRouter.post('/', isLoggenIn, isAdmin, categoryValidation, runValidation, addCategory)
categoriesRouter.post('/', categoriesControllers_1.addCategory);
// categoriesRouter.put(
//   '/:id',
//   isLoggenIn,
//   isAdmin,
//   categoryValidation,
//   runValidation,
//   updateSingleCategory
// )
categoriesRouter.put('/:id', categoriesControllers_1.updateSingleCategory);
// categoriesRouter.delete('/:id', isLoggenIn, isAdmin, deleteCategory)
categoriesRouter.delete('/:id', categoriesControllers_1.deleteCategory);
exports.default = categoriesRouter;
