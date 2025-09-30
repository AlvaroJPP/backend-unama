import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { Event } from "../types/index.js";

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Event>("SELECT * FROM events");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Event>("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Evento não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar evento" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, organizacao_id, endereco, data, image, categoria_id } = req.body as Partial<Event>;
    const result = await pool.query<Event>(
      `INSERT INTO events (nome, descricao, organizacao_id, endereco, data, image, categoria_id, criado_em)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
       RETURNING *`,
      [nome, descricao, organizacao_id, endereco, data, image, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar evento" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, organizacao_id, endereco, data, image, categoria_id } = req.body as Partial<Event>;
    const result = await pool.query<Event>(
      `UPDATE events SET nome=$1, descricao=$2, organizacao_id=$3, endereco=$4, data=$5, image=$6, categoria_id=$7
       WHERE id=$8 RETURNING *`,
      [nome, descricao, organizacao_id, endereco, data, image, categoria_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Evento não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Event>("DELETE FROM events WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Evento não encontrado" });
    res.json({ message: "Evento deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar evento" });
  }
};
