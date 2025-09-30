import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { Organization } from "../types/index.js";

export const getOrganizations = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Organization>("SELECT * FROM organizations");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar organizações" });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Organization>("SELECT * FROM organizations WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Organização não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar organização" });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, site } = req.body as Partial<Organization>;
    const result = await pool.query<Organization>(
      `INSERT INTO organizations (nome, descricao, site, criado_em)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [nome, descricao, site]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar organização" });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, site } = req.body as Partial<Organization>;
    const result = await pool.query<Organization>(
      `UPDATE organizations SET nome=$1, descricao=$2, site=$3
       WHERE id=$4 RETURNING *`,
      [nome, descricao, site, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Organização não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar organização" });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Organization>("DELETE FROM organizations WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Organização não encontrada" });
    res.json({ message: "Organização deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar organização" });
  }
};
