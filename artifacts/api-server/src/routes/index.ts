import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import verifyRouter from "./verify";
import scansRouter from "./scans";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(verifyRouter);
router.use(scansRouter);

export default router;
