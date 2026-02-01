import { Router } from "express";

export default function pacienteRoutes(controller) {
  const router = Router();
  router.post("/", (req, res) => controller.create(req, res));
  router.get("/", (req, res) => controller.getAll(req, res));
  return router;
}
//podemos agregar mas tipos si se requiere