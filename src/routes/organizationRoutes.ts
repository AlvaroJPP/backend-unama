import { Router } from "express";
import { getOrganizations, getOrganizationById, createOrganization, updateOrganization, deleteOrganization } from "../controllers/organizationController.ts";

const router = Router();

router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

export default router;
