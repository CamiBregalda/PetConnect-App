import { Schema, model } from "mongoose";

export interface VeterinarioAttributes {
  nome: string;
  email: string;
  telefone: string;
  crmv: string;
  abrigoId: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const VeterinarioSchema = new Schema<VeterinarioAttributes>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    crmv: { type: String, required: true },
    abrigoId: { type: String, required: true },
    ativo: { type: Boolean, required: true },
  },
  {
    collection: "veterinarios",
    timestamps: true,
  }
);

const VeterinarioModel = model<VeterinarioAttributes>("Veterinario", VeterinarioSchema);
export default VeterinarioModel;