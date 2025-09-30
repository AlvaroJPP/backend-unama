import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import type { EventImage } from "../types/index.ts";

export const getEventImages = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<EventImage>("SELECT * FROM event_images");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
};

export const getEventImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<EventImage>("SELECT * FROM event_images WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Imagem não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar imagem" });
  }
};

export const createEventImage = async (req: Request, res: Response) => {
  try {
    const { event_id, url } = req.body as Partial<EventImage>;
    const result = await pool.query<EventImage>(
      `INSERT INTO event_images (event_id, url, criado_em)
       VALUES ($1,$2,NOW())
       RETURNING *`,
      [event_id, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar imagem" });
  }
};

export const updateEventImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { event_id, url } = req.body as Partial<EventImage>;
    const result = await pool.query<EventImage>(
      `UPDATE event_images SET event_id=$1, url=$2 WHERE id=$3 RETURNING *`,
      [event_id, url, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Imagem não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar imagem" });
  }
};

export const deleteEventImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<EventImage>("DELETE FROM event_images WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Imagem não encontrada" });
    res.json({ message: "Imagem deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar imagem" });
  }
};
