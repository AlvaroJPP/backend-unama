import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import type { Comment } from "../types/index.ts";

export const getComments = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Comment>("SELECT * FROM comments");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Comment>("SELECT * FROM comments WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Comentário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar comentário" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { user_id, event_id, comentario, rating } = req.body as Partial<Comment>;
    const result = await pool.query<Comment>(
      `INSERT INTO comments (user_id, event_id, comentario, rating, criado_em)
       VALUES ($1,$2,$3,$4,NOW())
       RETURNING *`,
      [user_id, event_id, comentario, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, event_id, comentario, rating } = req.body as Partial<Comment>;
    const result = await pool.query<Comment>(
      `UPDATE comments SET user_id=$1, event_id=$2, comentario=$3, rating=$4
       WHERE id=$5 RETURNING *`,
      [user_id, event_id, comentario, rating, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Comentário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar comentário" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Comment>("DELETE FROM comments WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Comentário não encontrado" });
    res.json({ message: "Comentário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar comentário" });
  }
};
