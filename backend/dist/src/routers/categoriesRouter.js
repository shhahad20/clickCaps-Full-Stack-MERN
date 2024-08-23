import { Router } from 'express';
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateSingleCategory, } from '../controllers/categoriesControllers.js';
import { categoryValidation } from '../validation/categoryValidator.js';
import { runValidation } from '../validation/index.js';
const categoriesRouter = Router();
categoriesRouter.get('/', getAllCategories);
categoriesRouter.get('/:id', getSingleCategory);
// categoriesRouter.post('/', isLoggenIn, isAdmin, categoryValidation, runValidation, addCategory)
categoriesRouter.post('/', categoryValidation, runValidation, addCategory);
// categoriesRouter.put(
//   '/:id',
//   isLoggenIn,
//   isAdmin,
//   categoryValidation,
//   runValidation,
//   updateSingleCategory
// )
categoriesRouter.put('/:id', categoryValidation, runValidation, updateSingleCategory);
// categoriesRouter.delete('/:id', isLoggenIn, isAdmin, deleteCategory)
categoriesRouter.delete('/:id', deleteCategory);
export default categoriesRouter;
