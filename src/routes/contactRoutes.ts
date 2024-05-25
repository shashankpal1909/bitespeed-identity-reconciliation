import { Router } from "express";

import { identifyContact } from "../controllers/contactController";

const router = Router();
router.post("/", identifyContact);

export default router;
