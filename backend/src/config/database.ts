import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://guilago018:senhabd@cluster0.lfaqfms.mongodb.net/PetConnect", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado ao MongoDB com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};
