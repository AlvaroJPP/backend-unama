import type{ Request, Response } from "express";
import { pool } from "../config/db.ts";
import type{ Category } from "../types/index.ts";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Category>("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Category>("SELECT * FROM categories WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body as Partial<Category>;
    const result = await pool.query<Category>(
      `INSERT INTO categories (nome)
       VALUES ($1)
       RETURNING *`,
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome } = req.body as Partial<Category>;
    const result = await pool.query<Category>(
      `UPDATE categories SET nome=$1
       WHERE id=$2 RETURNING *`,
      [nome, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Category>("DELETE FROM categories WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
};
