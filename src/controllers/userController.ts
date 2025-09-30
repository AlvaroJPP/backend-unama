
import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import type { User } from "../types/index.ts";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<User>("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body as Partial<User>;
    const result = await pool.query<User>(
      `INSERT INTO users (nome, email, senha, tipo, data_criacao)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [nome, email, senha, tipo || "user"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body as Partial<User>;
    const result = await pool.query<User>(
      `UPDATE users SET nome=$1, email=$2, senha=$3, tipo=$4
       WHERE id=$5 RETURNING *`,
      [nome, email, senha, tipo, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<User>("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
